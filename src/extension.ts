import * as vscode from 'vscode';

// Constants for particle simulation
const MAX_PARTICLES = 100;
const PARTICLE_DURATION_MS = 600;
const SPAWN_THROTTLE_MS = 25;

// Particle symbol characters
const SYMBOLS = ['●', '◆', '■', '★', '✦', '⬥', '•'];

// Color palettes
const COLORS = [
    '#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1',
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E9', '#82E0AA'
];

const WOW_COLORS = [
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00',
    '#0000FF', '#4B0082', '#9400D3', '#FF1493',
    '#00FFFF', '#FF4500', '#7CFC00', '#FF69B4'
];

interface ActiveParticle {
    decorationType: vscode.TextEditorDecorationType;
    timeout: ReturnType<typeof setTimeout>;
}

let activeParticles: ActiveParticle[] = [];
let wowMode = false;
let enabled = true;
let statusBarItem: vscode.StatusBarItem;
let lastSpawnTime = 0;
let comboCount = 0;
let comboTimeout: ReturnType<typeof setTimeout> | undefined;

export function activate(context: vscode.ExtensionContext) {
    // Register commands
    const toggleWowCmd = vscode.commands.registerCommand('hyperpower.toggleWow', () => {
        wowMode = !wowMode;
        vscode.window.showInformationMessage(
            wowMode ? '🔥 WOW such on! 🔥' : 'WOW such off'
        );
        updateStatusBar();
    });

    const enableCmd = vscode.commands.registerCommand('hyperpower.enable', () => {
        enabled = true;
        vscode.window.showInformationMessage('⚡ Hyperpower enabled!');
        updateStatusBar();
    });

    const disableCmd = vscode.commands.registerCommand('hyperpower.disable', () => {
        enabled = false;
        clearAllParticles();
        vscode.window.showInformationMessage('Hyperpower disabled');
        updateStatusBar();
    });

    // Listen for text document changes to spawn particles
    const onDocChange = vscode.workspace.onDidChangeTextDocument((event) => {
        if (!enabled) { return; }
        const editor = vscode.window.activeTextEditor;
        if (!editor || event.document !== editor.document) { return; }
        if (event.contentChanges.length === 0) { return; }

        // Throttle particle spawning
        const now = Date.now();
        if (now - lastSpawnTime < SPAWN_THROTTLE_MS) { return; }
        lastSpawnTime = now;

        // Update combo counter
        comboCount++;
        if (comboTimeout) { clearTimeout(comboTimeout); }
        comboTimeout = setTimeout(() => { comboCount = 0; }, 1000);

        // Spawn particles at cursor position
        const cursorPos = editor.selection.active;
        spawnParticles(editor, cursorPos);
    });

    // Status bar item
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right, 100
    );
    statusBarItem.command = 'hyperpower.toggleWow';
    updateStatusBar();
    statusBarItem.show();

    context.subscriptions.push(toggleWowCmd, enableCmd, disableCmd, onDocChange, statusBarItem);
}

function updateStatusBar(): void {
    if (!enabled) {
        statusBarItem.text = '$(circle-slash) Hyperpower';
        statusBarItem.backgroundColor = undefined;
    } else if (wowMode) {
        statusBarItem.text = '$(flame) WOW MODE';
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    } else {
        statusBarItem.text = '$(zap) Hyperpower';
        statusBarItem.backgroundColor = undefined;
    }
}

function spawnParticles(editor: vscode.TextEditor, position: vscode.Position): void {
    const colors = wowMode ? WOW_COLORS : COLORS;
    const numParticles = wowMode
        ? 5 + Math.round(Math.random() * 7)
        : 3 + Math.round(Math.random() * 3);

    // Limit total active particles
    while (activeParticles.length > MAX_PARTICLES) {
        const old = activeParticles.shift();
        if (old) {
            clearTimeout(old.timeout);
            old.decorationType.dispose();
        }
    }

    for (let i = 0; i < numParticles; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const offsetX = Math.random() * 20 - 10;
        const offsetY = Math.random() * 20 - 10;
        const size = 6 + Math.random() * 8;
        const symbol = wowMode
            ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
            : SYMBOLS[Math.floor(Math.random() * 3)];

        const decorationType = vscode.window.createTextEditorDecorationType({
            after: {
                contentText: symbol,
                color: color,
                textDecoration: `none; position: relative; top: ${offsetY}px; left: ${offsetX}px; font-size: ${size}px; opacity: 0.9; pointer-events: none;`
            },
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });

        const range = new vscode.Range(position, position);
        editor.setDecorations(decorationType, [range]);

        // Remove particle after duration
        const duration = PARTICLE_DURATION_MS + Math.random() * 200;
        const timeout = setTimeout(() => {
            decorationType.dispose();
            const idx = activeParticles.findIndex(p => p.decorationType === decorationType);
            if (idx >= 0) { activeParticles.splice(idx, 1); }
        }, duration);

        activeParticles.push({ decorationType, timeout });
    }
}

function clearAllParticles(): void {
    for (const particle of activeParticles) {
        clearTimeout(particle.timeout);
        particle.decorationType.dispose();
    }
    activeParticles = [];
}

export function deactivate(): void {
    clearAllParticles();
}
