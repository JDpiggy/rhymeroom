/**
 * RhymeRoom - Free Online Rap Lyric Writing Studio
 * Main Application Controller
 */

const App = (() => {
    // State
    let currentProjectId = null;
    let autoSaveTimer = null;
    let autoRhymeTimer = null;
    let lastSavedContent = '';
    let highlightedLines = []; // Track which lines are highlighted

    // Theme color presets for custom color population
    const themeColorPresets = {
        dark: {
            primary: '#ff006e',
            primaryDark: '#d10055',
            secondary: '#8338ec',
            accent: '#00d9ff',
            success: '#00ff41',
            danger: '#ff006e',
            warning: '#ffbe0b',
            bgPrimary: '#0a0e27',
            bgSecondary: '#1a1f3a',
            bgTertiary: '#252d4a',
            textPrimary: '#ffffff',
            textSecondary: '#b0b5c0',
            borderColor: '#3a4562'
        },
        light: {
            primary: '#d10055',
            primaryDark: '#a80044',
            secondary: '#6c2fbf',
            accent: '#00a8e8',
            success: '#00cc33',
            danger: '#d10055',
            warning: '#e6a000',
            bgPrimary: '#f5f7fa',
            bgSecondary: '#ffffff',
            bgTertiary: '#eeeff5',
            textPrimary: '#1a1a2e',
            textSecondary: '#5a5f7f',
            borderColor: '#daddec'
        },
        forest: {
            primary: '#27ae60',
            primaryDark: '#1e8449',
            secondary: '#1e8449',
            accent: '#2ecc71',
            success: '#58d68d',
            danger: '#e74c3c',
            warning: '#f39c12',
            bgPrimary: '#0a1a0f',
            bgSecondary: '#1a2f1a',
            bgTertiary: '#2d4a2d',
            textPrimary: '#e8f4e8',
            textSecondary: '#b8d4b8',
            borderColor: '#4a6a4a'
        },
        sunset: {
            primary: '#e67e22',
            primaryDark: '#d35400',
            secondary: '#d35400',
            accent: '#f39c12',
            success: '#58d68d',
            danger: '#e74c3c',
            warning: '#f1c40f',
            bgPrimary: '#1a0a05',
            bgSecondary: '#2f1a0a',
            bgTertiary: '#4a2d1a',
            textPrimary: '#fff4e8',
            textSecondary: '#e8d4b8',
            borderColor: '#6a5a3a'
        }
    };

    // DOM Elements
    const elements = {
        // Header
        projectSelect: document.getElementById('projectSelect'),
        newProjectBtn: document.getElementById('newProjectBtn'),
        projectName: document.getElementById('projectName'),
        themeToggle: document.getElementById('themeToggle'),
        settingsBtn: document.getElementById('settingsBtn'),

        // Editor
        lyricsEditor: document.getElementById('lyricsEditor'),
        lineNumbers: document.getElementById('lineNumbers'),
        highlightOverlay: document.getElementById('highlightOverlay'),
        lineNumbersToggle: document.getElementById('lineNumbersToggle'),
        clearEditorBtn: document.getElementById('clearEditorBtn'),
        autoSaveIndicator: document.getElementById('autoSaveIndicator'),

        // Beat
        beatUrl: document.getElementById('beatUrl'),
        embedBeatBtn: document.getElementById('embedBeatBtn'),
        beatEmbed: document.getElementById('beatEmbed'),
        clearBeatBtn: document.getElementById('clearBeatBtn'),
        beatFileInput: document.getElementById('beatFileInput'),
        beatFileName: document.getElementById('beatFileName'),
        beatFileUploadBtn: document.getElementById('beatFileUploadBtn'),
        beatVolumeControl: document.getElementById('beatVolumeControl'),
        beatVolume: document.getElementById('beatVolume'),
        saveCurrentBeatBtn: document.getElementById('saveCurrentBeatBtn'),
        myBeatsList: document.getElementById('myBeatsList'),

        // Rhyme
        rhymeCompareMode: document.getElementById('rhymeCompareMode'),
        rhymeTargetLine: document.getElementById('rhymeTargetLine'),
        runRhymeCheckBtn: document.getElementById('runRhymeCheckBtn'),
        clearHighlightBtn: document.getElementById('clearHighlightBtn'),
        autoRhymeCheck: document.getElementById('autoRhymeCheck'),
        rhymeScoreValue: document.getElementById('rhymeScoreValue'),
        rhymeScoreFill: document.getElementById('rhymeScoreFill'),
        avgStrengthValue: document.getElementById('avgStrengthValue'),
        rhymeDensityValue: document.getElementById('rhymeDensityValue'),
        schemeValue: document.getElementById('schemeValue'),
        rhymeResults: document.getElementById('rhymeResults'),

        // Theme
        themeBtns: document.querySelectorAll('.theme-btn'),

        // Tab Navigation
        tabBtns: document.querySelectorAll('.tab-btn'),
        editorTab: document.getElementById('editorTab'),
        rhythmTab: document.getElementById('rhythmTab'),
        settingsTab: document.getElementById('settingsTab'),

        // Rhythm Tab
        rhythmBeatUrl: document.getElementById('rhythmBeatUrl'),
        rhythmEmbedBeatBtn: document.getElementById('rhythmEmbedBeatBtn'),
        rhythmBeatEmbed: document.getElementById('rhythmBeatEmbed'),
        rhythmClearBeatBtn: document.getElementById('rhythmClearBeatBtn'),
        rhythmPlaceholder: document.getElementById('rhythmPlaceholder'),
        rhythmBeatFileInput: document.getElementById('rhythmBeatFileInput'),
        rhythmBeatFileName: document.getElementById('rhythmBeatFileName'),
        rhythmBeatVolumeControl: document.getElementById('rhythmBeatVolumeControl'),
        rhythmBeatVolume: document.getElementById('rhythmBeatVolume'),
        saveRhythmBeatBtn: document.getElementById('saveRhythmBeatBtn'),
        rhythmMyBeatsList: document.getElementById('rhythmMyBeatsList'),

        // Record Tab
        recordBeatVolume: document.getElementById('recordBeatVolume'),
        recordMetronomeVolume: document.getElementById('recordMetronomeVolume'),
        inputDeviceSelect: document.getElementById('inputDeviceSelect'),
        outputDeviceSelect: document.getElementById('outputDeviceSelect'),
        enterRecordModeBtn: document.getElementById('enterRecordModeBtn'),
        recordSetupPanel: document.getElementById('recordSetupPanel'),
        recordModePanel: document.getElementById('recordModePanel'),
        recordBeatEmbed: document.getElementById('recordBeatEmbed'),
        recordLyricsContent: document.getElementById('recordLyricsContent'),
        recordProgressFill: document.getElementById('recordProgressFill'),
        recordCurrentTime: document.getElementById('recordCurrentTime'),
        recordTotalTime: document.getElementById('recordTotalTime'),
        startRecordingBtn: document.getElementById('startRecordingBtn'),
        stopRecordingBtn: document.getElementById('stopRecordingBtn'),
        exitRecordModeBtn: document.getElementById('exitRecordModeBtn'),
        recordIndicator: document.getElementById('recordIndicator'),

        // Metronome
        bpmSlider: document.getElementById('bpmSlider'),
        bpmInput: document.getElementById('bpmInput'),
        bpmValue: document.getElementById('bpmValue'),
        metronomeSound: document.getElementById('metronomeSound'),
        metronomeVolume: document.getElementById('metronomeVolume'),
        metronomePlayBtn: document.getElementById('metronomePlayBtn'),
        metronomeIndicator: document.getElementById('metronomeIndicator'),

        // Custom Colors
        colorPrimary: document.getElementById('colorPrimary'),
        colorPrimaryDark: document.getElementById('colorPrimaryDark'),
        colorSecondary: document.getElementById('colorSecondary'),
        colorAccent: document.getElementById('colorAccent'),
        colorSuccess: document.getElementById('colorSuccess'),
        colorDanger: document.getElementById('colorDanger'),
        colorWarning: document.getElementById('colorWarning'),
        colorBgPrimary: document.getElementById('colorBgPrimary'),
        colorBgSecondary: document.getElementById('colorBgSecondary'),
        colorBgTertiary: document.getElementById('colorBgTertiary'),
        colorTextPrimary: document.getElementById('colorTextPrimary'),
        colorTextSecondary: document.getElementById('colorTextSecondary'),
        colorBorderColor: document.getElementById('colorBorderColor'),
        resetColorsBtn: document.getElementById('resetColorsBtn'),

        // Color Mode
        colorModeRadios: document.querySelectorAll('input[name="colorMode"]'),
        presetThemeSelector: document.getElementById('presetThemeSelector'),
        customColorsSection: document.getElementById('customColorsSection'),

        // AI Settings
        aiRhymeEnabled: document.getElementById('aiRhymeEnabled'),
        aiApiKey: document.getElementById('aiApiKey'),
        saveAiSettingsBtn: document.getElementById('saveAiSettingsBtn'),

        // AI Tab
        aiChatMessages: document.getElementById('aiChatMessages'),
        aiChatInput: document.getElementById('aiChatInput'),
        aiSendBtn: document.getElementById('aiSendBtn'),
        aiRhymeWord: document.getElementById('aiRhymeWord'),
        aiFindRhymesBtn: document.getElementById('aiFindRhymesBtn'),
        aiRhymeResults: document.getElementById('aiRhymeResults'),
        aiImproveInput: document.getElementById('aiImproveInput'),
        aiImproveBtn: document.getElementById('aiImproveBtn'),
        aiImproveResults: document.getElementById('aiImproveResults'),
        aiHookTopic: document.getElementById('aiHookTopic'),
        aiGenerateHookBtn: document.getElementById('aiGenerateHookBtn'),
        aiHookResults: document.getElementById('aiHookResults'),
        aiAnalyzeBtn: document.getElementById('aiAnalyzeBtn'),
        aiAnalyzeResults: document.getElementById('aiAnalyzeResults'),
        aiStatusDetection: document.getElementById('aiStatusDetection'),
        aiStatusKey: document.getElementById('aiStatusKey'),
        aiRhymeToggleMain: document.getElementById('aiRhymeToggleMain'),
        aiToggleStatus: document.getElementById('aiToggleStatus'),

        // Modals
        newProjectModal: document.getElementById('newProjectModal'),
        newProjectName: document.getElementById('newProjectName'),
        confirmNewProject: document.getElementById('confirmNewProject'),
        fontFamilySelect: document.getElementById('fontFamilySelect'),
        fontSizeSelect: document.getElementById('fontSizeSelect'),
        lineHeightSelect: document.getElementById('lineHeightSelect'),
        exportProjectBtn: document.getElementById('exportProjectBtn'),
        deleteProjectBtn: document.getElementById('deleteProjectBtn')
    };

    // Metronome State
    let metronomeState = {
        isPlaying: false,
        bpm: 120,
        intervalId: null,
        audioContext: null,
        nextNoteTime: 0,
        volume: 0.5
    };

    // Recording State
    let recordingState = {
        isRecording: false,
        mediaRecorder: null,
        audioChunks: [],
        stream: null,
        startTime: null,
        progressInterval: null
    };

    /**
     * Metronome Functions
     */
    const Metronome = {
        initAudioContext() {
            if (!metronomeState.audioContext) {
                metronomeState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        },

        playClick(soundType) {
            this.initAudioContext();
            const ctx = metronomeState.audioContext;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            const now = ctx.currentTime;
            const volume = metronomeState.volume;

            switch (soundType) {
                case 'click':
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(1000, now);
                    gainNode.gain.setValueAtTime(volume, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                    oscillator.start(now);
                    oscillator.stop(now + 0.1);
                    break;
                case 'beep':
                    oscillator.type = 'square';
                    oscillator.frequency.setValueAtTime(880, now);
                    gainNode.gain.setValueAtTime(volume * 0.6, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                    oscillator.start(now);
                    oscillator.stop(now + 0.05);
                    break;
                case 'wood':
                    oscillator.type = 'triangle';
                    oscillator.frequency.setValueAtTime(600, now);
                    gainNode.gain.setValueAtTime(volume * 0.8, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                    oscillator.start(now);
                    oscillator.stop(now + 0.15);
                    break;
                case 'digital':
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(1200, now);
                    gainNode.gain.setValueAtTime(volume * 0.4, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
                    oscillator.start(now);
                    oscillator.stop(now + 0.03);
                    break;
            }
        },

        start() {
            if (metronomeState.isPlaying) return;

            this.initAudioContext();
            metronomeState.isPlaying = true;
            elements.metronomePlayBtn.textContent = '⏸ Stop';
            elements.metronomePlayBtn.classList.remove('btn-primary');
            elements.metronomePlayBtn.classList.add('btn-danger');

            const interval = (60 / metronomeState.bpm) * 1000;

            metronomeState.intervalId = setInterval(() => {
                const sound = elements.metronomeSound.value;
                this.playClick(sound);

                // Visual indicator
                elements.metronomeIndicator.classList.add('active');
                setTimeout(() => {
                    elements.metronomeIndicator.classList.remove('active');
                }, 100);
            }, interval);
        },

        stop() {
            if (!metronomeState.isPlaying) return;

            metronomeState.isPlaying = false;
            elements.metronomePlayBtn.textContent = '▶ Play';
            elements.metronomePlayBtn.classList.remove('btn-danger');
            elements.metronomePlayBtn.classList.add('btn-primary');

            if (metronomeState.intervalId) {
                clearInterval(metronomeState.intervalId);
                metronomeState.intervalId = null;
            }

            elements.metronomeIndicator.classList.remove('active');
        },

        toggle() {
            if (metronomeState.isPlaying) {
                this.stop();
            } else {
                this.start();
            }
        },

        setBPM(bpm) {
            metronomeState.bpm = Math.min(1000, Math.max(1, bpm));
            elements.bpmValue.textContent = metronomeState.bpm;
            elements.bpmInput.value = metronomeState.bpm;

            // Clamp slider value to 40-240 range for visual display
            const sliderValue = Math.min(240, Math.max(40, metronomeState.bpm));
            elements.bpmSlider.value = sliderValue;

            // Restart if playing to apply new BPM
            if (metronomeState.isPlaying) {
                this.stop();
                this.start();
            }
        },

        setVolume(volume) {
            metronomeState.volume = Math.min(1, Math.max(0, volume));
        },

        setSound(soundType) {
            // Sound change takes effect on next beat
        }
    };

    /**
     * Recording Functions
     */
    const Recording = {
        async enumerateAudioDevices() {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                const devices = await navigator.mediaDevices.enumerateDevices();

                const inputDevices = devices.filter(device => device.kind === 'audioinput');
                const outputDevices = devices.filter(device => device.kind === 'audiooutput');

                elements.inputDeviceSelect.innerHTML = '<option value="">Select input device...</option>';
                elements.outputDeviceSelect.innerHTML = '<option value="">Select output device...</option>';

                inputDevices.forEach(device => {
                    const option = document.createElement('option');
                    option.value = device.deviceId;
                    option.textContent = device.label || `Microphone ${inputDevices.indexOf(device) + 1}`;
                    elements.inputDeviceSelect.appendChild(option);
                });

                outputDevices.forEach(device => {
                    const option = document.createElement('option');
                    option.value = device.deviceId;
                    option.textContent = device.label || `Speaker ${outputDevices.indexOf(device) + 1}`;
                    elements.outputDeviceSelect.appendChild(option);
                });
            } catch (error) {
                console.error('Error enumerating audio devices:', error);
                alert('Could not access audio devices. Please grant microphone permissions.');
            }
        },

        async startRecording() {
            try {
                // Find and embed beat from other tabs
                findAndEmbedBeat();

                // Apply record volume to beat
                const recordAudioOrVideo = elements.recordBeatEmbed.querySelector('audio, video');
                if (recordAudioOrVideo) {
                    recordAudioOrVideo.volume = parseFloat(elements.recordBeatVolume.value);
                    recordAudioOrVideo.currentTime = 0;
                    recordAudioOrVideo.play();
                }

                const constraints = {
                    audio: {
                        deviceId: elements.inputDeviceSelect.value ? { exact: elements.inputDeviceSelect.value } : undefined
                    }
                };

                recordingState.stream = await navigator.mediaDevices.getUserMedia(constraints);
                recordingState.mediaRecorder = new MediaRecorder(recordingState.stream);
                recordingState.audioChunks = [];

                recordingState.mediaRecorder.ondataavailable = (event) => {
                    recordingState.audioChunks.push(event.data);
                };

                recordingState.mediaRecorder.onstop = () => {
                    this.saveRecording();
                };

                recordingState.mediaRecorder.start();
                recordingState.isRecording = true;
                recordingState.startTime = Date.now();

                // Update UI
                elements.startRecordingBtn.style.display = 'none';
                elements.stopRecordingBtn.style.display = 'block';
                elements.recordIndicator.style.display = 'flex';

                // Start progress tracking
                this.startProgressTracking();
            } catch (error) {
                console.error('Error starting recording:', error);
                alert('Could not start recording. Please check your audio device selection.');
            }
        },

        stopRecording() {
            if (recordingState.mediaRecorder && recordingState.isRecording) {
                recordingState.mediaRecorder.stop();
                recordingState.isRecording = false;

                if (recordingState.stream) {
                    recordingState.stream.getTracks().forEach(track => track.stop());
                }

                // Stop beat
                const recordAudioOrVideo = elements.recordBeatEmbed.querySelector('audio, video');
                if (recordAudioOrVideo) {
                    recordAudioOrVideo.pause();
                    recordAudioOrVideo.currentTime = 0;
                }

                // Stop progress tracking
                if (recordingState.progressInterval) {
                    clearInterval(recordingState.progressInterval);
                }

                // Update UI
                elements.startRecordingBtn.style.display = 'block';
                elements.stopRecordingBtn.style.display = 'none';
                elements.recordIndicator.style.display = 'none';
            }
        },

        startProgressTracking() {
            recordingState.progressInterval = setInterval(() => {
                const elapsed = Date.now() - recordingState.startTime;
                const seconds = Math.floor(elapsed / 1000);
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;

                elements.recordCurrentTime.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

                // Update progress bar (assuming 5 minute max for visualization)
                const progress = Math.min((elapsed / 300000) * 100, 100);
                elements.recordProgressFill.style.width = `${progress}%`;
            }, 100);
        },

        saveRecording() {
            const audioBlob = new Blob(recordingState.audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);

            // Generate filename with date, time, and project name
            const now = new Date();
            const date = now.toISOString().split('T')[0];
            const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
            const projectName = elements.projectName.value || 'Untitled';
            const format = document.querySelector('input[name="recordFormat"]:checked').value;

            const filename = `${date}_${time}_${projectName.replace(/\s+/g, '_')}.${format}`;

            // Create download link
            const a = document.createElement('a');
            a.href = audioUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            alert(`Recording saved as ${filename}`);
        }
    };

    /**
     * Initialize the application
     */
    const init = () => {
        // Ensure storage is initialized first
        Storage.initialize();

        // Initialize highlight overlay
        elements.highlightOverlay.classList.add('hidden');

        // Initialize tabs - set editor tab as active
        elements.tabBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.querySelector('[data-tab="editor"]').classList.add('active');
        elements.editorTab.classList.add('active');

        // Load settings
        applySettings();

        // Render saved beats
        renderMyBeats();
        renderRhythmMyBeats();

        // Populate projects
        populateProjectSelector();

        // Load first project or create default
        const projects = Storage.getProjects();
        if (projects.length > 0) {
            loadProject(projects[0].id);
        } else {
            const newProject = Storage.createProject('My First Track');
            loadProject(newProject.id);
        }

        // Attach event listeners
        attachEventListeners();

        // Apply initial theme
        const settings = Storage.getSettings();
        applyTheme(settings.theme);
    };

    /**
     * Attach all event listeners
     */
    const attachEventListeners = () => {
        // Project management
        elements.projectSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                loadProject(e.target.value);
            }
        });

        elements.newProjectBtn.addEventListener('click', openNewProjectModal);
        elements.projectName.addEventListener('blur', updateProjectName);

        // Editor
        elements.lyricsEditor.addEventListener('input', handleEditorInput);
        elements.lyricsEditor.addEventListener('keydown', handleEditorKeydown);
        elements.lyricsEditor.addEventListener('scroll', syncScroll);
        elements.lineNumbers.addEventListener('scroll', syncLineNumbersScroll);
        elements.lineNumbersToggle.addEventListener('change', toggleLineNumbers);
        elements.clearEditorBtn.addEventListener('click', clearEditor);

        // Beat
        elements.beatUrl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleBeatEmbed();
            }
        });
        elements.embedBeatBtn.addEventListener('click', handleBeatEmbed);
        elements.clearBeatBtn.addEventListener('click', handleClearBeat);
        elements.beatFileInput.addEventListener('change', handleBeatFileUpload);
        elements.beatVolume.addEventListener('input', handleBeatVolumeChange);
        elements.saveCurrentBeatBtn.addEventListener('click', saveCurrentBeat);

        // Rhyme
        elements.runRhymeCheckBtn.addEventListener('click', runRhymeCheck);
        elements.clearHighlightBtn.addEventListener('click', clearHighlights);
        elements.autoRhymeCheck.addEventListener('change', toggleAutoRhymeCheck);
        elements.rhymeCompareMode.addEventListener('change', () => {
            if (elements.autoRhymeCheck.checked) {
                runRhymeCheck();
            }
        });
        elements.rhymeTargetLine.addEventListener('change', () => {
            if (elements.autoRhymeCheck.checked) {
                runRhymeCheck();
            }
        });

        // Theme
        elements.themeBtns.forEach(btn => {
            btn.addEventListener('click', handleThemeChange);
        });
        elements.themeToggle.addEventListener('click', toggleTheme);

        // Tab Navigation
        elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                switchTab(e.target.dataset.tab);
            });
        });

        // Rhythm Tab
        elements.rhythmBeatUrl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleRhythmBeatEmbed();
            }
        });
        elements.rhythmEmbedBeatBtn.addEventListener('click', handleRhythmBeatEmbed);
        elements.rhythmClearBeatBtn.addEventListener('click', handleRhythmClearBeat);
        elements.rhythmBeatFileInput.addEventListener('change', handleRhythmBeatFileUpload);
        elements.rhythmBeatVolume.addEventListener('input', handleRhythmBeatVolumeChange);
        elements.saveRhythmBeatBtn.addEventListener('click', saveRhythmBeat);

        // Record Tab
        elements.recordBeatVolume.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            const recordAudioOrVideo = elements.recordBeatEmbed.querySelector('audio, video');
            if (recordAudioOrVideo) {
                recordAudioOrVideo.volume = volume;
            }
        });
        elements.recordMetronomeVolume.addEventListener('input', (e) => {
            Metronome.setVolume(parseFloat(e.target.value));
        });
        elements.enterRecordModeBtn.addEventListener('click', handleEnterRecordMode);
        elements.startRecordingBtn.addEventListener('click', () => Recording.startRecording());
        elements.stopRecordingBtn.addEventListener('click', () => Recording.stopRecording());
        elements.exitRecordModeBtn.addEventListener('click', handleExitRecordMode);

        // Metronome
        elements.bpmSlider.addEventListener('input', (e) => {
            Metronome.setBPM(parseInt(e.target.value));
        });
        elements.bpmInput.addEventListener('input', (e) => {
            Metronome.setBPM(parseInt(e.target.value));
        });
        elements.metronomeSound.addEventListener('change', (e) => {
            Metronome.setSound(e.target.value);
        });
        elements.metronomeVolume.addEventListener('input', (e) => {
            Metronome.setVolume(parseFloat(e.target.value));
        });
        elements.metronomePlayBtn.addEventListener('click', () => {
            Metronome.toggle();
        });

        // Settings
        elements.fontFamilySelect.addEventListener('change', updateFontFamily);
        elements.fontSizeSelect.addEventListener('change', updateFontSize);
        elements.lineHeightSelect.addEventListener('change', updateLineHeight);
        elements.exportProjectBtn.addEventListener('click', exportProject);
        elements.deleteProjectBtn.addEventListener('click', deleteProject);

        // Custom Colors
        elements.colorPrimary.addEventListener('input', handleColorChange);
        elements.colorPrimaryDark.addEventListener('input', handleColorChange);
        elements.colorSecondary.addEventListener('input', handleColorChange);
        elements.colorAccent.addEventListener('input', handleColorChange);
        elements.colorSuccess.addEventListener('input', handleColorChange);
        elements.colorDanger.addEventListener('input', handleColorChange);
        elements.colorWarning.addEventListener('input', handleColorChange);
        elements.colorBgPrimary.addEventListener('input', handleColorChange);
        elements.colorBgSecondary.addEventListener('input', handleColorChange);
        elements.colorBgTertiary.addEventListener('input', handleColorChange);
        elements.colorTextPrimary.addEventListener('input', handleColorChange);
        elements.colorTextSecondary.addEventListener('input', handleColorChange);
        elements.colorBorderColor.addEventListener('input', handleColorChange);
        elements.resetColorsBtn.addEventListener('click', resetColors);

        // Color Mode
        elements.colorModeRadios.forEach(radio => {
            radio.addEventListener('change', handleColorModeChange);
        });

        // AI Settings
        elements.saveAiSettingsBtn.addEventListener('click', saveAISettings);

        // AI Tab
        elements.aiSendBtn.addEventListener('click', sendAiChat);
        elements.aiChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendAiChat();
            }
        });
        elements.aiFindRhymesBtn.addEventListener('click', findAiRhymes);
        elements.aiImproveBtn.addEventListener('click', improveWithAi);
        elements.aiGenerateHookBtn.addEventListener('click', generateHook);
        elements.aiAnalyzeBtn.addEventListener('click', analyzeWithAi);
        elements.aiRhymeToggleMain.addEventListener('change', toggleAiFromMain);

        // Modals
        attachModalListeners();
    };

    /**
     * Attach modal event listeners
     */
    const attachModalListeners = () => {
        // Close modals
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });

        document.querySelectorAll('.modal-cancel').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });

        // New project modal
        elements.confirmNewProject.addEventListener('click', createNewProject);
        elements.newProjectName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                createNewProject();
            }
        });

        // Close modals on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeAllModals();
                }
            });
        });
    };

    /**
     * Load a project
     */
    const loadProject = (projectId) => {
        const project = Storage.getProject(projectId);
        if (!project) return;

        currentProjectId = projectId;
        lastSavedContent = project.lyrics;

        // Update UI
        elements.projectSelect.value = projectId;
        elements.projectName.value = project.name;
        elements.lyricsEditor.value = project.lyrics;
        elements.beatUrl.value = '';
        elements.beatFileName.textContent = '';
        elements.beatFileInput.value = '';
        BeatEmbedder.clearBeat(elements.beatEmbed);
        elements.clearBeatBtn.style.display = 'none';
        elements.beatVolumeControl.style.display = 'none';

        // Load beat if exists
        if (project.beatUrl) {
            elements.beatUrl.value = project.beatUrl;
            handleBeatEmbed();
        }

        // Update line numbers
        updateLineNumbers();

        // Sync scroll position
        syncScroll();

        // Update auto-save indicator
        updateAutoSaveIndicator('Saved');
    };

    /**
     * Handle editor input
     */
    const handleEditorInput = () => {
        updateLineNumbers();
        scheduleSave();

        // Auto rhyme check
        if (elements.autoRhymeCheck.checked) {
            scheduleAutoRhymeCheck();
        }

        // Auto calculate rhyme score
        calculateRhymeScore();
    };

    /**
     * Handle editor keydown for special keys
     */
    const handleEditorKeydown = (e) => {
        // Tab indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = elements.lyricsEditor.selectionStart;
            const end = elements.lyricsEditor.selectionEnd;
            const value = elements.lyricsEditor.value;

            elements.lyricsEditor.value = value.substring(0, start) + '\t' + value.substring(end);
            elements.lyricsEditor.selectionStart = elements.lyricsEditor.selectionEnd = start + 1;
            handleEditorInput();
        }
    };

    /**
     * Schedule auto-save
     */
    const scheduleSave = () => {
        clearTimeout(autoSaveTimer);
        updateAutoSaveIndicator('Unsaved changes');

        autoSaveTimer = setTimeout(() => {
            saveCurrentProject();
        }, 1000);
    };

    /**
     * Save current project
     */
    const saveCurrentProject = () => {
        if (!currentProjectId) return;

        const lyrics = elements.lyricsEditor.value;
        const beatUrl = elements.beatUrl.value;

        Storage.updateProject(currentProjectId, {
            lyrics: lyrics,
            beatUrl: beatUrl
        });

        lastSavedContent = lyrics;
        updateAutoSaveIndicator('Saved');
    };

    /**
     * Update auto-save indicator
     */
    const updateAutoSaveIndicator = (status) => {
        elements.autoSaveIndicator.textContent = status;
        elements.autoSaveIndicator.className = 'auto-save-indicator';
        
        if (status === 'Unsaved changes') {
            elements.autoSaveIndicator.classList.add('saving');
        } else {
            elements.autoSaveIndicator.classList.add('saved');
        }
    };

    /**
     * Update line numbers
     */
    const updateLineNumbers = () => {
        const textLines = elements.lyricsEditor.value.split('\n');
        let lineNumbersHtml = '';
        let lineCount = 0;

        // Only number non-empty lines
        textLines.forEach((line) => {
            if (line.trim() !== '') {
                lineCount++;
                lineNumbersHtml += lineCount;
            }
            lineNumbersHtml += '\n';
        });

        elements.lineNumbers.textContent = lineNumbersHtml;
        // Sync all font properties with editor
        const editorStyle = window.getComputedStyle(elements.lyricsEditor);
        elements.lineNumbers.style.fontFamily = editorStyle.fontFamily;
        elements.lineNumbers.style.fontSize = editorStyle.fontSize;
        elements.lineNumbers.style.lineHeight = editorStyle.lineHeight;
        elements.lineNumbers.style.letterSpacing = editorStyle.letterSpacing;
        elements.lineNumbers.style.fontWeight = editorStyle.fontWeight;
        // Sync padding top to match editor
        elements.lineNumbers.style.paddingTop = editorStyle.paddingTop;
        elements.lineNumbers.style.paddingBottom = editorStyle.paddingBottom;
    };

    /**
     * Toggle line numbers
     */
    const toggleLineNumbers = () => {
        elements.lineNumbers.classList.toggle('active');
        Storage.updateSettings({ lineNumbers: elements.lineNumbersToggle.checked });
    };

    /**
     * Clear editor
     */
    const clearEditor = () => {
        if (confirm('Clear all lyrics? This cannot be undone.')) {
            elements.lyricsEditor.value = '';
            elements.rhymeResults.innerHTML = '<p class="results-placeholder">Run rhyme check to see results</p>';
            handleEditorInput();
        }
    };

    /**
     * Handle beat embed
     */
    const handleBeatEmbed = async () => {
        const url = elements.beatUrl.value.trim();
        if (!url) {
            handleClearBeat();
            return;
        }

        const result = await BeatEmbedder.embedBeat(url, elements.beatEmbed);

        if (result.success) {
            elements.clearBeatBtn.style.display = 'block';
            // Show volume control only for local file embeds (audio/video elements)
            const hasAudioOrVideo = elements.beatEmbed.querySelector('audio, video');
            elements.beatVolumeControl.style.display = hasAudioOrVideo ? 'flex' : 'none';
            scheduleSave();
        } else {
            alert('Could not embed beat: ' + result.error);
        }
    };

    /**
     * Handle beat file upload
     */
    const handleBeatFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Display file name
        elements.beatFileName.textContent = file.name;

        // Embed the file
        const result = BeatEmbedder.embedLocalFile(file, elements.beatEmbed);

        if (result.success) {
            elements.clearBeatBtn.style.display = 'block';
            elements.beatVolumeControl.style.display = 'flex';
            elements.beatUrl.value = '';
            scheduleSave();
        } else {
            alert('Could not embed file: ' + result.error);
        }

        // Clear file input
        elements.beatFileInput.value = '';
    };

    /**
     * Handle clear beat
     */
    const handleClearBeat = () => {
        elements.beatUrl.value = '';
        elements.beatFileName.textContent = '';
        elements.beatFileInput.value = '';
        BeatEmbedder.clearBeat(elements.beatEmbed);
        elements.clearBeatBtn.style.display = 'none';
        elements.beatVolumeControl.style.display = 'none';
        scheduleSave();
    };

    /**
     * Handle beat volume change
     */
    const handleBeatVolumeChange = (e) => {
        const volume = parseFloat(e.target.value);
        const audioOrVideo = elements.beatEmbed.querySelector('audio, video');
        if (audioOrVideo) {
            audioOrVideo.volume = volume;
        }
    };

    /**
     * Run rhyme check
     */
    const runRhymeCheck = async () => {
        const lyrics = elements.lyricsEditor.value;
        const targetLine = parseInt(elements.rhymeTargetLine.value) - 1;
        const compareMode = elements.rhymeCompareMode.value;

        if (!lyrics.trim()) {
            elements.rhymeResults.innerHTML = '<p class="results-placeholder">Add lyrics to check rhymes</p>';
            return;
        }

        const analysis = await RhymeDetector.analyzeRhymes(lyrics, targetLine, compareMode);

        if (analysis.error) {
            elements.rhymeResults.innerHTML = `<p class="results-placeholder">${analysis.error}</p>`;
            return;
        }

        // Get highlight data with all lines (no limit)
        const highlightData = await RhymeDetector.getHighlightData(lyrics, targetLine, compareMode, analysis.results.length);
        applyHighlights(highlightData.highlightLines);
        displayRhymeResults(analysis);
    };

    /**
     * Get strength category for rhyme strength value
     */
    const getStrengthCategory = (strength) => {
        if (strength >= 85) return 'perfect';
        if (strength >= 75) return 'good';
        if (strength >= 65) return 'fair';
        if (strength >= 55) return 'weak';
        return 'none';
    };

    /**
     * Build highlighted HTML for editor overlay
     */
    const buildHighlightedContent = (lyrics, highlightLines, compareMode) => {
        const lines = lyrics.split('\n');
        let html = '';

        lines.forEach((line, lineIdx) => {
            // Check if this line should have highlights
            const highlightData = highlightLines.find(h => h.lineIndex === lineIdx);
            let highlightedLine = line;

            if (highlightData && highlightData.strength > 0) {
                // Find and highlight the matched word/segment based on compare mode
                const segmentRegex = new RegExp(
                    `\\b${highlightData.segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
                    'gi'
                );

                const category = getStrengthCategory(highlightData.strength);
                highlightedLine = line.replace(segmentRegex, (match) => {
                    return `<span class="rhyme-word strength-${category}" title="Strength: ${highlightData.strength}%">${match}</span>`;
                });
            }

            html += highlightedLine;
            if (lineIdx < lines.length - 1) {
                html += '\n';
            }
        });

        return html;
    };

    /**
     * Apply highlighting to the editor overlay
     */
    const applyHighlights = (highlightLines) => {
        clearHighlights();
        
        if (!highlightLines || highlightLines.length === 0) {
            return;
        }

        // Store highlight info for later reference
        highlightedLines = highlightLines;
        
        // Get the compare mode for highlighting
        const compareMode = elements.rhymeCompareMode.value;
        
        // Build highlighted HTML content
        const lyrics = elements.lyricsEditor.value;
        const highlightedHtml = buildHighlightedContent(lyrics, highlightLines, compareMode);
        
        // Apply to overlay
        elements.highlightOverlay.innerHTML = highlightedHtml;
        elements.highlightOverlay.classList.add('active');
        elements.highlightOverlay.classList.remove('hidden');

        // Sync scroll position
        syncScroll();

        // Apply visual indicator class
        elements.lyricsEditor.classList.add('has-rhyme-highlights');
        
        // Display summary info
        displayHighlightSummary(highlightLines);
    };

    /**
     * Sync scroll position between textarea, line numbers, and highlight overlay
     */
    const syncScroll = () => {
        if (elements.highlightOverlay) {
            elements.highlightOverlay.scrollTop = elements.lyricsEditor.scrollTop;
            elements.highlightOverlay.scrollLeft = elements.lyricsEditor.scrollLeft;
        }
        if (elements.lineNumbers) {
            elements.lineNumbers.scrollTop = elements.lyricsEditor.scrollTop;
        }
    };

    /**
     * Sync editor scroll when line numbers are scrolled
     */
    const syncLineNumbersScroll = () => {
        elements.lyricsEditor.scrollTop = elements.lineNumbers.scrollTop;
        if (elements.highlightOverlay) {
            elements.highlightOverlay.scrollTop = elements.lineNumbers.scrollTop;
        }
    };

    /**
     * Display summary of highlighted lines
     */
    const displayHighlightSummary = (highlightLines) => {
        let summaryHtml = '<div style="font-size: 12px; padding: 8px; background: rgba(0,255,65,0.1); border-radius: 4px;">';
        summaryHtml += '<div style="color: var(--success); font-weight: 600; margin-bottom: 6px;">Highlighted lines:</div>';
        
        highlightLines.forEach(h => {
            const category = getStrengthCategory(h.strength);
            const colors = {
                perfect: '#ff006e',
                good: '#ff8c00',
                fair: '#ffbe0b',
                weak: '#00ff41',
                none: '#888'
            };
            const color = colors[category] || '#888';
            summaryHtml += `<div style="margin: 4px 0; color: ${color};">
                Line ${h.lineIndex + 1}: "${h.segment}" (${h.strength}%)
            </div>`;
        });
        
        summaryHtml += '</div>';
        elements.rhymeResults.innerHTML = summaryHtml;
        elements.clearHighlightBtn.style.display = 'block';
    };

    /**
     * Clear all highlights
     */
    const clearHighlights = () => {
        highlightedLines = [];
        elements.highlightOverlay.innerHTML = '';
        elements.highlightOverlay.classList.remove('active');
        elements.highlightOverlay.classList.add('hidden');
        elements.lyricsEditor.classList.remove('has-rhyme-highlights');
        elements.clearHighlightBtn.style.display = 'none';
        elements.rhymeResults.innerHTML = '<p class="results-placeholder">Run rhyme check to see results</p>';
    };

    /**
     * Display rhyme check results
     */
    const displayRhymeResults = (analysis) => {
        let html = `<div class="rhyme-analysis">
            <div style="font-size: 12px; color: var(--accent); margin-bottom: 8px; font-weight: 600;">
                Target: Line ${analysis.targetLineNumber} - "${analysis.targetSegment}"
            </div>`;

        if (analysis.results.length === 0) {
            html += '<p class="results-placeholder">No matches found</p>';
        } else {
            // Show all results instead of limiting
            analysis.results.forEach(result => {
                const matchClass = result.isMatch ? 'match' : 'no-match';
                const strengthLabel = result.strength >= 80 ? '🔥' : result.strength >= 60 ? '✓' : '✗';

                html += `<div class="rhyme-result-line">
                    <div class="result-line-number">
                        Line ${result.lineNumber} ${strengthLabel} (${result.strength})
                    </div>
                    <div class="result-content">
                        <span style="color: var(--text-secondary); font-size: 11px;">${result.lineText.substring(0, 35)}${result.lineText.length > 35 ? '...' : ''}</span>
                    </div>
                </div>`;
            });
        }

        html += '</div>';
        elements.rhymeResults.innerHTML = html;
    };

    /**
     * Calculate and display overall rhyme score
     */
    const calculateRhymeScore = async () => {
        const lyrics = elements.lyricsEditor.value;

        if (!lyrics.trim()) {
            elements.rhymeScoreValue.textContent = '--';
            elements.rhymeScoreFill.style.width = '0%';
            elements.avgStrengthValue.textContent = '--';
            elements.rhymeDensityValue.textContent = '--';
            elements.schemeValue.textContent = '--';
            return;
        }

        const breakdown = await RhymeDetector.getRhymeScoreBreakdown(lyrics);

        // Update score display
        elements.rhymeScoreValue.textContent = breakdown.overall;
        elements.rhymeScoreFill.style.width = `${breakdown.overall}%`;

        // Update details
        elements.avgStrengthValue.textContent = `${breakdown.avgStrength}%`;
        elements.rhymeDensityValue.textContent = `${breakdown.rhymeDensity}%`;
        elements.schemeValue.textContent = breakdown.scheme || 'N/A';

        // Color code the score
        if (breakdown.overall >= 80) {
            elements.rhymeScoreValue.style.color = 'var(--success)';
        } else if (breakdown.overall >= 60) {
            elements.rhymeScoreValue.style.color = 'var(--warning)';
        } else if (breakdown.overall >= 40) {
            elements.rhymeScoreValue.style.color = 'var(--primary)';
        } else {
            elements.rhymeScoreValue.style.color = 'var(--danger)';
        }
    };

    /**
     * Render the saved beats list
     */
    const renderMyBeats = () => {
        const beats = Storage.getBeats();

        if (beats.length === 0) {
            elements.myBeatsList.innerHTML = '<p style="font-size: 12px; color: var(--text-secondary); text-align: center; padding: 8px;">No saved beats</p>';
            return;
        }

        elements.myBeatsList.innerHTML = '';
        beats.forEach(beat => {
            const beatItem = document.createElement('div');
            beatItem.className = 'saved-beat-item';
            beatItem.dataset.beatId = beat.id;

            const beatInfo = document.createElement('div');
            beatInfo.className = 'saved-beat-info';

            const beatName = document.createElement('div');
            beatName.className = 'saved-beat-name';
            beatName.textContent = beat.name;

            const beatType = document.createElement('div');
            beatType.className = 'saved-beat-type';
            beatType.textContent = beat.type === 'url' ? 'URL' : 'File';

            beatInfo.appendChild(beatName);
            beatInfo.appendChild(beatType);

            const beatActions = document.createElement('div');
            beatActions.className = 'saved-beat-actions';

            const loadBtn = document.createElement('button');
            loadBtn.className = 'saved-beat-action-btn';
            loadBtn.innerHTML = '▶';
            loadBtn.title = 'Load beat';
            loadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                loadSavedBeat(beat.id);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'saved-beat-action-btn delete';
            deleteBtn.innerHTML = '✕';
            deleteBtn.title = 'Delete beat';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSavedBeat(beat.id);
            });

            beatActions.appendChild(loadBtn);
            beatActions.appendChild(deleteBtn);

            beatItem.appendChild(beatInfo);
            beatItem.appendChild(beatActions);

            beatItem.addEventListener('click', () => {
                loadSavedBeat(beat.id);
            });

            elements.myBeatsList.appendChild(beatItem);
        });
    };

    /**
     * Save the current rhythm beat to storage
     */
    const saveRhythmBeat = () => {
        const beatUrl = elements.rhythmBeatUrl.value.trim();
        const beatFileName = elements.rhythmBeatFileName.textContent.trim();

        if (!beatUrl && !beatFileName) {
            alert('No beat loaded to save');
            return;
        }

        const beatName = prompt('Enter a name for this beat:');
        if (!beatName) return;

        const beat = {
            name: beatName,
            type: beatUrl ? 'url' : 'file',
            url: beatUrl,
            fileName: beatFileName
        };

        if (Storage.saveBeat(beat)) {
            renderRhythmMyBeats();
            alert('Beat saved successfully!');
        } else {
            alert('Failed to save beat');
        }
    };

    /**
     * Render the saved beats list for rhythm tab
     */
    const renderRhythmMyBeats = () => {
        const beats = Storage.getBeats();

        if (beats.length === 0) {
            elements.rhythmMyBeatsList.innerHTML = '<p style="font-size: 12px; color: var(--text-secondary); text-align: center; padding: 8px;">No saved beats</p>';
            return;
        }

        elements.rhythmMyBeatsList.innerHTML = '';
        beats.forEach(beat => {
            const beatItem = document.createElement('div');
            beatItem.className = 'saved-beat-item';
            beatItem.dataset.beatId = beat.id;

            const beatInfo = document.createElement('div');
            beatInfo.className = 'saved-beat-info';

            const beatName = document.createElement('div');
            beatName.className = 'saved-beat-name';
            beatName.textContent = beat.name;

            const beatType = document.createElement('div');
            beatType.className = 'saved-beat-type';
            beatType.textContent = beat.type === 'url' ? 'URL' : 'File';

            beatInfo.appendChild(beatName);
            beatInfo.appendChild(beatType);

            const beatActions = document.createElement('div');
            beatActions.className = 'saved-beat-actions';

            const loadBtn = document.createElement('button');
            loadBtn.className = 'saved-beat-action-btn';
            loadBtn.innerHTML = '▶';
            loadBtn.title = 'Load beat';
            loadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                loadRhythmSavedBeat(beat.id);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'saved-beat-action-btn delete';
            deleteBtn.innerHTML = '✕';
            deleteBtn.title = 'Delete beat';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSavedBeat(beat.id);
                renderRhythmMyBeats();
            });

            beatActions.appendChild(loadBtn);
            beatActions.appendChild(deleteBtn);

            beatItem.appendChild(beatInfo);
            beatItem.appendChild(beatActions);

            beatItem.addEventListener('click', () => {
                loadRhythmSavedBeat(beat.id);
            });

            elements.rhythmMyBeatsList.appendChild(beatItem);
        });
    };

    /**
     * Load a saved beat into rhythm tab
     */
    const loadRhythmSavedBeat = (beatId) => {
        const beat = Storage.getBeat(beatId);
        if (!beat) return;

        if (beat.type === 'url') {
            elements.rhythmBeatUrl.value = beat.url;
            elements.rhythmBeatFileName.textContent = '';
            elements.rhythmBeatFileInput.value = '';
            handleRhythmBeatEmbed();
        } else {
            // For file beats, prompt user to re-upload
            alert(`File beat: "${beat.fileName}"\n\nPlease upload the file again to use this beat.`);
            elements.rhythmBeatFileName.textContent = beat.fileName;
            elements.rhythmBeatUrl.value = '';
            elements.rhythmBeatFileInput.click();
        }

        // Update active state in UI
        document.querySelectorAll('#rhythmMyBeatsList .saved-beat-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.beatId === beatId) {
                item.classList.add('active');
            }
        });
    };

    /**
     * Save the current beat to storage
     */
    const saveCurrentBeat = () => {
        const beatUrl = elements.beatUrl.value.trim();
        const beatFileName = elements.beatFileName.textContent.trim();

        if (!beatUrl && !beatFileName) {
            alert('No beat loaded to save');
            return;
        }

        const beatName = prompt('Enter a name for this beat:');
        if (!beatName) return;

        const beat = {
            name: beatName,
            type: beatUrl ? 'url' : 'file',
            url: beatUrl,
            fileName: beatFileName
        };

        if (Storage.saveBeat(beat)) {
            renderMyBeats();
            renderRhythmMyBeats();
            alert('Beat saved successfully!');
        } else {
            alert('Failed to save beat');
        }
    };

    /**
     * Load a saved beat
     */
    const loadSavedBeat = (beatId) => {
        const beat = Storage.getBeat(beatId);
        if (!beat) return;

        if (beat.type === 'url') {
            elements.beatUrl.value = beat.url;
            elements.beatFileName.textContent = '';
            elements.beatFileInput.value = '';
            handleBeatEmbed();
        } else {
            // For file beats, prompt user to re-upload
            alert(`File beat: "${beat.fileName}"\n\nPlease upload the file again to use this beat.`);
            elements.beatFileName.textContent = beat.fileName;
            elements.beatUrl.value = '';
            elements.beatFileInput.click();
        }

        // Update active state in UI
        document.querySelectorAll('.saved-beat-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.beatId === beatId) {
                item.classList.add('active');
            }
        });
    };

    /**
     * Delete a saved beat
     */
    const deleteSavedBeat = (beatId) => {
        if (!confirm('Are you sure you want to delete this beat?')) return;

        if (Storage.deleteBeat(beatId)) {
            renderMyBeats();
            renderRhythmMyBeats();
        } else {
            alert('Failed to delete beat');
        }
    };

    /**
     * Schedule auto rhyme check
     */
    const scheduleAutoRhymeCheck = () => {
        clearTimeout(autoRhymeTimer);
        autoRhymeTimer = setTimeout(() => {
            runRhymeCheck();
        }, 500);
    };

    /**
     * Toggle auto rhyme check
     */
    const toggleAutoRhymeCheck = () => {
        Storage.updateSettings({ autoRhymeCheck: elements.autoRhymeCheck.checked });
        if (elements.autoRhymeCheck.checked) {
            runRhymeCheck();
        }
    };

    /**
     * Handle color mode change (preset vs custom)
     */
    const handleColorModeChange = (e) => {
        const mode = e.target.value;
        if (mode === 'preset') {
            elements.presetThemeSelector.style.display = 'block';
            elements.customColorsSection.style.display = 'none';
            // Re-apply current theme to ensure preset is active
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            applyTheme(currentTheme);
        } else {
            elements.presetThemeSelector.style.display = 'none';
            elements.customColorsSection.style.display = 'block';
            // Populate color pickers with current theme colors
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            populateColorPickersFromTheme(currentTheme);
            // Apply current custom colors if they exist
            const settings = Storage.getSettings();
            if (settings.customColors) {
                applyCustomColors(settings.customColors);
            }
        }
        Storage.updateSettings({ colorMode: mode });
    };

    /**
     * Populate color pickers from theme preset
     */
    const populateColorPickersFromTheme = (theme) => {
        const preset = themeColorPresets[theme] || themeColorPresets.dark;
        elements.colorPrimary.value = preset.primary;
        elements.colorPrimaryDark.value = preset.primaryDark;
        elements.colorSecondary.value = preset.secondary;
        elements.colorAccent.value = preset.accent;
        elements.colorSuccess.value = preset.success;
        elements.colorDanger.value = preset.danger;
        elements.colorWarning.value = preset.warning;
        elements.colorBgPrimary.value = preset.bgPrimary;
        elements.colorBgSecondary.value = preset.bgSecondary;
        elements.colorBgTertiary.value = preset.bgTertiary;
        elements.colorTextPrimary.value = preset.textPrimary;
        elements.colorTextSecondary.value = preset.textSecondary;
        elements.colorBorderColor.value = preset.borderColor;
    };

    /**
     * Handle theme change
     */
    const handleThemeChange = (e) => {
        const theme = e.target.dataset.theme;
        applyTheme(theme);
    };

    /**
     * Apply theme
     */
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        Storage.updateSettings({ theme: theme });

        // Clear custom color inline styles so theme colors take effect
        const root = document.documentElement;
        const colorVars = [
            '--primary', '--primary-dark', '--secondary', '--accent',
            '--success', '--danger', '--warning',
            '--bg-primary', '--bg-secondary', '--bg-tertiary',
            '--text-primary', '--text-secondary', '--border-color'
        ];

        colorVars.forEach(varName => {
            root.style.removeProperty(varName);
        });

        // If in custom mode, populate color pickers with the new theme colors
        const colorMode = document.querySelector('input[name="colorMode"]:checked')?.value || 'preset';
        if (colorMode === 'custom') {
            populateColorPickersFromTheme(theme);
        }

        // Update active button
        elements.themeBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });

        // Update moon/sun icon
        updateThemeToggleIcon(theme);
    };

    /**
     * Update theme toggle icon
     */
    const updateThemeToggleIcon = (theme) => {
        const themes = {
            dark: '�',
            light: '☀️',
            ocean: '🌊',
            royal: '💜',
            forest: '🌲',
            sunset: '🌅'
        };
        elements.themeToggle.textContent = themes[theme] || '�';
    };

    /**
     * Toggle theme between dark and light
     */
    const toggleTheme = () => {
        const settings = Storage.getSettings();
        const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    };

    /**
     * Switch between tabs
     */
    const switchTab = (tabName) => {
        // Update tab content visibility
        elements.tabBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Show selected tab
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');

        // Sync beat URL when switching to rhythm tab
        if (tabName === 'rhythm') {
            elements.rhythmBeatUrl.value = elements.beatUrl.value;
            if (elements.beatUrl.value) {
                handleRhythmBeatEmbed();
            }
        }

        // Initialize audio devices when switching to record tab
        if (tabName === 'record') {
            Recording.enumerateAudioDevices();
        }
    };

    /**
     * Handle rhythm beat embed
     */
    const handleRhythmBeatEmbed = async () => {
        const url = elements.rhythmBeatUrl.value.trim();
        if (!url) {
            handleRhythmClearBeat();
            return;
        }

        const result = await BeatEmbedder.embedBeat(url, elements.rhythmBeatEmbed);

        if (result.success) {
            elements.rhythmClearBeatBtn.style.display = 'block';
            elements.rhythmPlaceholder.style.display = 'none';
            // Also update the main beat URL
            elements.beatUrl.value = url;

            // Set flex property for rhythm beat embed container
            elements.rhythmBeatEmbed.style.flex = '0 0 auto';

            // Show volume control only for local file embeds (audio/video elements)
            const hasAudioOrVideo = elements.rhythmBeatEmbed.querySelector('audio, video');
            elements.rhythmBeatVolumeControl.style.display = hasAudioOrVideo ? 'flex' : 'none';

            scheduleSave();
        } else {
            alert('Could not embed beat: ' + result.error);
        }
    };

    /**
     * Handle rhythm beat clear
     */
    const handleRhythmClearBeat = () => {
        elements.rhythmBeatUrl.value = '';
        elements.rhythmBeatFileName.textContent = '';
        elements.rhythmBeatFileInput.value = '';
        BeatEmbedder.clearBeat(elements.rhythmBeatEmbed);
        elements.rhythmClearBeatBtn.style.display = 'none';
        elements.rhythmPlaceholder.style.display = 'block';
        elements.rhythmBeatVolumeControl.style.display = 'none';
        // Reset flex property
        elements.rhythmBeatEmbed.style.flex = '';
        scheduleSave();
    };

    /**
     * Handle rhythm beat file upload
     */
    const handleRhythmBeatFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Display file name
        elements.rhythmBeatFileName.textContent = file.name;

        // Embed the file
        const result = BeatEmbedder.embedLocalFile(file, elements.rhythmBeatEmbed);

        if (result.success) {
            elements.rhythmClearBeatBtn.style.display = 'block';
            elements.rhythmPlaceholder.style.display = 'none';
            elements.rhythmBeatVolumeControl.style.display = 'flex';

            // Set flex property for rhythm beat embed container
            if (file.type.startsWith('audio/')) {
                elements.rhythmBeatEmbed.style.flex = '0 0 auto';
            } else if (file.type.startsWith('video/')) {
                elements.rhythmBeatEmbed.style.flex = '1';
            }

            // Clear URL input since we're using a file
            elements.rhythmBeatUrl.value = '';

            scheduleSave();
        } else {
            alert('Could not embed file: ' + result.error);
        }
    };

    /**
     * Handle rhythm beat volume change
     */
    const handleRhythmBeatVolumeChange = (e) => {
        const volume = parseFloat(e.target.value);
        const audioOrVideo = elements.rhythmBeatEmbed.querySelector('audio, video');
        if (audioOrVideo) {
            audioOrVideo.volume = volume;
        }
    };

    /**
     * Handle enter record mode
     */
    const handleEnterRecordMode = async () => {
        // Stop all beats in other tabs
        stopAllBeats();

        // Display lyrics in record mode
        elements.recordLyricsContent.textContent = elements.lyricsEditor.value;

        // Switch panels
        elements.recordSetupPanel.style.display = 'none';
        elements.recordModePanel.style.display = 'flex';

        // Sync volume sliders
        elements.recordBeatVolume.value = elements.beatVolume.value;
        elements.recordMetronomeVolume.value = elements.metronomeVolume.value;
    };

    /**
     * Stop all beats in all tabs
     */
    const stopAllBeats = () => {
        // Stop editor beat
        const editorAudioOrVideo = elements.beatEmbed.querySelector('audio, video');
        if (editorAudioOrVideo) {
            editorAudioOrVideo.pause();
            editorAudioOrVideo.currentTime = 0;
        }
        const editorIframe = elements.beatEmbed.querySelector('iframe');
        if (editorIframe) {
            BeatEmbedder.clearBeat(elements.beatEmbed);
        }

        // Stop rhythm beat
        const rhythmAudioOrVideo = elements.rhythmBeatEmbed.querySelector('audio, video');
        if (rhythmAudioOrVideo) {
            rhythmAudioOrVideo.pause();
            rhythmAudioOrVideo.currentTime = 0;
        }
        const rhythmIframe = elements.rhythmBeatEmbed.querySelector('iframe');
        if (rhythmIframe) {
            BeatEmbedder.clearBeat(elements.rhythmBeatEmbed);
        }

        // Stop metronome
        Metronome.stop();
    };

    /**
     * Find and embed beat from other tabs
     */
    const findAndEmbedBeat = () => {
        // Check editor beat first
        const editorAudioOrVideo = elements.beatEmbed.querySelector('audio, video');
        const editorIframe = elements.beatEmbed.querySelector('iframe');

        if (editorAudioOrVideo) {
            // Clone audio/video element
            const cloned = editorAudioOrVideo.cloneNode(true);
            elements.recordBeatEmbed.innerHTML = '';
            elements.recordBeatEmbed.appendChild(cloned);
            return true;
        } else if (editorIframe) {
            // Clone iframe
            const cloned = editorIframe.cloneNode(true);
            elements.recordBeatEmbed.innerHTML = '';
            elements.recordBeatEmbed.appendChild(cloned);
            return true;
        }

        // Check rhythm beat
        const rhythmAudioOrVideo = elements.rhythmBeatEmbed.querySelector('audio, video');
        const rhythmIframe = elements.rhythmBeatEmbed.querySelector('iframe');

        if (rhythmAudioOrVideo) {
            const cloned = rhythmAudioOrVideo.cloneNode(true);
            elements.recordBeatEmbed.innerHTML = '';
            elements.recordBeatEmbed.appendChild(cloned);
            return true;
        } else if (rhythmIframe) {
            const cloned = rhythmIframe.cloneNode(true);
            elements.recordBeatEmbed.innerHTML = '';
            elements.recordBeatEmbed.appendChild(cloned);
            return true;
        }

        return false;
    };

    /**
     * Handle exit record mode
     */
    const handleExitRecordMode = () => {
        // Stop recording if active
        if (recordingState.isRecording) {
            Recording.stopRecording();
        }

        // Stop beat in record panel
        const recordAudioOrVideo = elements.recordBeatEmbed.querySelector('audio, video');
        if (recordAudioOrVideo) {
            recordAudioOrVideo.pause();
            recordAudioOrVideo.currentTime = 0;
        }
        BeatEmbedder.clearBeat(elements.recordBeatEmbed);

        // Switch panels
        elements.recordModePanel.style.display = 'none';
        elements.recordSetupPanel.style.display = 'flex';

        // Reset progress
        elements.recordProgressFill.style.width = '0%';
        elements.recordCurrentTime.textContent = '0:00';
    };

    /**
     * Toggle theme between dark and light
     */
    const populateProjectSelector = () => {
        const projects = Storage.getProjects();
        const currentOptions = Array.from(elements.projectSelect.options)
            .map(opt => opt.value)
            .filter(val => val); // Exclude empty option

        // Clear existing project options
        Array.from(elements.projectSelect.options)
            .reverse()
            .forEach(opt => {
                if (opt.value) elements.projectSelect.removeChild(opt);
            });

        // Add projects
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = `${project.name}`;
            elements.projectSelect.appendChild(option);
        });
    };

    /**
     * Update project name
     */
    const updateProjectName = () => {
        const newName = elements.projectName.value.trim();
        if (!newName) {
            const project = Storage.getProject(currentProjectId);
            elements.projectName.value = project.name;
            return;
        }

        if (currentProjectId) {
            Storage.updateProject(currentProjectId, { name: newName });
            populateProjectSelector();
            elements.projectSelect.value = currentProjectId;
        }
    };

    /**
     * Open new project modal
     */
    const openNewProjectModal = () => {
        elements.newProjectName.value = '';
        elements.newProjectModal.classList.add('active');
        setTimeout(() => elements.newProjectName.focus(), 100);
    };

    /**
     * Create new project
     */
    const createNewProject = () => {
        const name = elements.newProjectName.value.trim();
        const projectName = name || `Project ${new Date().toLocaleDateString()}`;
        
        const newProject = Storage.createProject(projectName);
        populateProjectSelector();
        loadProject(newProject.id);
        closeAllModals();
    };

    /**
     * Close all modals
     */
    const closeAllModals = () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    };

    /**
     * Update font family
     */
    const updateFontFamily = () => {
        const family = elements.fontFamilySelect.value;
        // Update CSS variable - this will apply to all elements using it
        document.documentElement.style.setProperty('--editor-font', family);
        // Sync line numbers
        updateLineNumbers();
        Storage.updateSettings({ fontFamily: family });
    };

    /**
     * Update font size
     */
    const updateFontSize = () => {
        const size = elements.fontSizeSelect.value;
        elements.lyricsEditor.style.fontSize = size + 'px';
        updateLineNumbers();
        Storage.updateSettings({ fontSize: parseInt(size) });
    };

    /**
     * Update line height
     */
    const updateLineHeight = () => {
        const height = elements.lineHeightSelect.value;
        elements.lyricsEditor.style.lineHeight = height;
        updateLineNumbers();
        Storage.updateSettings({ lineHeight: parseFloat(height) });
    };

    /**
     * Save AI settings
     */
    const saveAISettings = () => {
        const enabled = elements.aiRhymeEnabled.checked;
        const apiKey = elements.aiApiKey.value.trim();

        // Save to storage
        Storage.updateSettings({
            aiRhymeEnabled: enabled,
            aiApiKey: apiKey
        });

        // Initialize or update AI detector
        if (apiKey && enabled) {
            RhymeDetector.initAI(apiKey, true);
            updateAiStatus();
            alert('AI rhyme detection enabled successfully!');
        } else if (apiKey && !enabled) {
            RhymeDetector.initAI(apiKey, false);
            updateAiStatus();
            alert('AI rhyme detection disabled. API key saved.');
        } else if (!apiKey && enabled) {
            elements.aiRhymeEnabled.checked = false;
            alert('Please enter a valid API key to enable AI detection.');
        } else {
            RhymeDetector.initAI('', false);
            updateAiStatus();
            alert('AI settings cleared.');
        }
    };

    /**
     * Update AI status display
     */
    const updateAiStatus = () => {
        const settings = Storage.getSettings();
        const isEnabled = settings.aiRhymeEnabled && settings.aiApiKey;
        
        elements.aiStatusDetection.textContent = isEnabled ? 'Enabled' : 'Disabled';
        elements.aiStatusDetection.className = `ai-status-value ${isEnabled ? 'active' : 'inactive'}`;
        
        elements.aiStatusKey.textContent = settings.aiApiKey ? 'Configured' : 'Not configured';

        // Update prominent toggle
        elements.aiRhymeToggleMain.checked = isEnabled;
        elements.aiToggleStatus.textContent = isEnabled ? 'Enabled' : 'Disabled';
        elements.aiToggleStatus.className = `ai-toggle-status ${isEnabled ? 'active' : ''}`;
    };

    /**
     * Toggle AI from main editor
     */
    const toggleAiFromMain = () => {
        const settings = Storage.getSettings();
        const newEnabled = elements.aiRhymeToggleMain.checked;
        
        if (newEnabled && !settings.aiApiKey) {
            elements.aiRhymeToggleMain.checked = false;
            alert('Please configure your API key in Settings first.');
            return;
        }

        Storage.updateSettings({ aiRhymeEnabled: newEnabled });
        elements.aiRhymeEnabled.checked = newEnabled;
        
        if (newEnabled) {
            RhymeDetector.initAI(settings.aiApiKey, true);
        } else {
            RhymeDetector.initAI(settings.aiApiKey, false);
        }
        
        updateAiStatus();
    };

    /**
     * Call AI API for general chat
     */
    const callAiApi = async (prompt) => {
        const settings = Storage.getSettings();
        if (!settings.aiApiKey) {
            throw new Error('API key not configured. Please add your API key in Settings.');
        }

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.aiApiKey}`,
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'RhymeRoom'
                },
                body: JSON.stringify({
                    model: 'qwen/qwen-2-7b-instruct',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert rap lyric assistant. Help users with rhymes, flow improvement, word choice, and creative lyric suggestions. Be concise, creative, and practical. Focus on rap/hip-hop style.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || 'No response from AI.';
        } catch (error) {
            console.error('AI API error:', error);
            throw error;
        }
    };

    /**
     * Send AI chat message
     */
    const sendAiChat = async () => {
        const message = elements.aiChatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addAiMessage(message, 'user');
        elements.aiChatInput.value = '';

        // Show loading state
        const loadingId = addAiMessage('Thinking...', 'assistant', true);

        try {
            const response = await callAiApi(message);
            // Remove loading message and add response
            removeAiMessage(loadingId);
            addAiMessage(response, 'assistant');
        } catch (error) {
            removeAiMessage(loadingId);
            addAiMessage(`Error: ${error.message}`, 'assistant');
        }
    };

    /**
     * Add message to AI chat
     */
    const addAiMessage = (content, type, isLoading = false) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-${type}`;
        if (isLoading) messageDiv.id = `loading-${Date.now()}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'ai-message-content';
        contentDiv.innerHTML = `<p>${content}</p>`;
        
        messageDiv.appendChild(contentDiv);
        elements.aiChatMessages.appendChild(messageDiv);
        elements.aiChatMessages.scrollTop = elements.aiChatMessages.scrollHeight;
        
        return messageDiv.id;
    };

    /**
     * Remove message from AI chat
     */
    const removeAiMessage = (id) => {
        const element = document.getElementById(id);
        if (element) element.remove();
    };

    /**
     * Find rhymes using AI
     */
    const findAiRhymes = async () => {
        const word = elements.aiRhymeWord.value.trim();
        if (!word) {
            elements.aiRhymeResults.innerHTML = 'Please enter a word';
            return;
        }

        elements.aiRhymeResults.innerHTML = 'Finding rhymes...';

        try {
            const prompt = `Find 10 perfect rhymes for the word "${word}". Include both common and creative rhymes. Return as a simple comma-separated list.`;
            const response = await callAiApi(prompt);
            elements.aiRhymeResults.innerHTML = response;
        } catch (error) {
            elements.aiRhymeResults.innerHTML = `Error: ${error.message}`;
        }
    };

    /**
     * Improve lyrics using AI
     */
    const improveWithAi = async () => {
        const line = elements.aiImproveInput.value.trim();
        if (!line) {
            elements.aiImproveResults.innerHTML = 'Please enter a line to improve';
            return;
        }

        elements.aiImproveResults.innerHTML = 'Improving...';

        try {
            const prompt = `Improve this rap line to make it flow better and have more impact: "${line}". Provide 3 alternative versions with different styles (punchy, melodic, complex).`;
            const response = await callAiApi(prompt);
            elements.aiImproveResults.innerHTML = response.replace(/\n/g, '<br>');
        } catch (error) {
            elements.aiImproveResults.innerHTML = `Error: ${error.message}`;
        }
    };

    /**
     * Generate hook ideas using AI
     */
    const generateHook = async () => {
        const topic = elements.aiHookTopic.value.trim();
        if (!topic) {
            elements.aiHookResults.innerHTML = 'Please enter a topic';
            return;
        }

        elements.aiHookResults.innerHTML = 'Generating hook ideas...';

        try {
            const prompt = `Generate 3 creative hook ideas for a rap song about "${topic}". Make them catchy and memorable. Include the hook lyrics and a brief description of the vibe.`;
            const response = await callAiApi(prompt);
            elements.aiHookResults.innerHTML = response.replace(/\n/g, '<br>');
        } catch (error) {
            elements.aiHookResults.innerHTML = `Error: ${error.message}`;
        }
    };

    /**
     * Analyze lyrics using AI
     */
    const analyzeWithAi = async () => {
        const lyrics = elements.lyricsEditor.value.trim();
        if (!lyrics) {
            elements.aiAnalyzeResults.innerHTML = 'No lyrics to analyze';
            return;
        }

        elements.aiAnalyzeResults.innerHTML = 'Analyzing...';

        try {
            const prompt = `Analyze these rap lyrics and provide feedback on: rhyme scheme quality, flow/cadence, word choice, and overall impact. Be constructive and specific. Lyrics:\n\n${lyrics}`;
            const response = await callAiApi(prompt);
            elements.aiAnalyzeResults.innerHTML = response.replace(/\n/g, '<br>');
        } catch (error) {
            elements.aiAnalyzeResults.innerHTML = `Error: ${error.message}`;
        }
    };

    /**
     * Apply settings from storage
     */
    const applySettings = () => {
        const settings = Storage.getSettings();

        // Apply theme
        applyTheme(settings.theme);

        // Apply color mode
        const colorMode = settings.colorMode || 'preset';
        const colorModeRadio = document.querySelector(`input[name="colorMode"][value="${colorMode}"]`);
        if (colorModeRadio) {
            colorModeRadio.checked = true;
        }
        if (colorMode === 'preset') {
            elements.presetThemeSelector.style.display = 'block';
            elements.customColorsSection.style.display = 'none';
        } else {
            elements.presetThemeSelector.style.display = 'none';
            elements.customColorsSection.style.display = 'block';
            // Populate color pickers with current theme colors initially
            populateColorPickersFromTheme(settings.theme || 'dark');
        }

        elements.lineNumbersToggle.checked = settings.lineNumbers;
        if (settings.lineNumbers) {
            elements.lineNumbers.classList.add('active');
        }

        elements.fontFamilySelect.value = settings.fontFamily;
        document.documentElement.style.setProperty('--editor-font', settings.fontFamily);

        elements.fontSizeSelect.value = settings.fontSize;
        elements.lyricsEditor.style.fontSize = settings.fontSize + 'px';

        elements.lineHeightSelect.value = settings.lineHeight;
        elements.lyricsEditor.style.lineHeight = settings.lineHeight;

        // Sync line numbers with editor settings
        updateLineNumbers();

        elements.autoRhymeCheck.checked = settings.autoRhymeCheck;
        elements.rhymeCompareMode.value = settings.rhymeCompareMode;

        // Apply AI settings
        elements.aiRhymeEnabled.checked = settings.aiRhymeEnabled || false;
        elements.aiApiKey.value = settings.aiApiKey || 'MYSTERYAPIKEY';
        
        // Initialize AI detector with saved settings
        if (settings.aiApiKey && settings.aiRhymeEnabled) {
            RhymeDetector.initAI(settings.aiApiKey, true);
        }

        // Update AI status display
        updateAiStatus();

        // Apply custom colors
        if (settings.customColors) {
            applyCustomColors(settings.customColors);
        }
    };

    /**
     * Apply custom colors
     */
    const applyCustomColors = (colors) => {
        const root = document.documentElement;

        if (colors.primary) {
            root.style.setProperty('--primary', colors.primary);
            elements.colorPrimary.value = colors.primary;
        }
        if (colors.primaryDark) {
            root.style.setProperty('--primary-dark', colors.primaryDark);
            elements.colorPrimaryDark.value = colors.primaryDark;
        }
        if (colors.secondary) {
            root.style.setProperty('--secondary', colors.secondary);
            elements.colorSecondary.value = colors.secondary;
        }
        if (colors.accent) {
            root.style.setProperty('--accent', colors.accent);
            elements.colorAccent.value = colors.accent;
        }
        if (colors.success) {
            root.style.setProperty('--success', colors.success);
            elements.colorSuccess.value = colors.success;
        }
        if (colors.danger) {
            root.style.setProperty('--danger', colors.danger);
            elements.colorDanger.value = colors.danger;
        }
        if (colors.warning) {
            root.style.setProperty('--warning', colors.warning);
            elements.colorWarning.value = colors.warning;
        }
        if (colors.bgPrimary) {
            root.style.setProperty('--bg-primary', colors.bgPrimary);
            elements.colorBgPrimary.value = colors.bgPrimary;
        }
        if (colors.bgSecondary) {
            root.style.setProperty('--bg-secondary', colors.bgSecondary);
            elements.colorBgSecondary.value = colors.bgSecondary;
        }
        if (colors.bgTertiary) {
            root.style.setProperty('--bg-tertiary', colors.bgTertiary);
            elements.colorBgTertiary.value = colors.bgTertiary;
        }
        if (colors.textPrimary) {
            root.style.setProperty('--text-primary', colors.textPrimary);
            elements.colorTextPrimary.value = colors.textPrimary;
        }
        if (colors.textSecondary) {
            root.style.setProperty('--text-secondary', colors.textSecondary);
            elements.colorTextSecondary.value = colors.textSecondary;
        }
        if (colors.borderColor) {
            root.style.setProperty('--border-color', colors.borderColor);
            elements.colorBorderColor.value = colors.borderColor;
        }
    };

    /**
     * Handle color change
     */
    const handleColorChange = () => {
        const colors = {
            primary: elements.colorPrimary.value,
            primaryDark: elements.colorPrimaryDark.value,
            secondary: elements.colorSecondary.value,
            accent: elements.colorAccent.value,
            success: elements.colorSuccess.value,
            danger: elements.colorDanger.value,
            warning: elements.colorWarning.value,
            bgPrimary: elements.colorBgPrimary.value,
            bgSecondary: elements.colorBgSecondary.value,
            bgTertiary: elements.colorBgTertiary.value,
            textPrimary: elements.colorTextPrimary.value,
            textSecondary: elements.colorTextSecondary.value,
            borderColor: elements.colorBorderColor.value
        };

        applyCustomColors(colors);
        Storage.updateSettings({ customColors: colors, colorMode: 'custom' });

        // Switch to custom mode if not already
        const customRadio = document.querySelector('input[name="colorMode"][value="custom"]');
        if (customRadio && !customRadio.checked) {
            customRadio.checked = true;
            handleColorModeChange({ target: customRadio });
        }
    };

    /**
     * Reset colors to default
     */
    const resetColors = () => {
        // Reset to current theme's preset colors
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const defaultColors = themeColorPresets[currentTheme] || themeColorPresets.dark;

        applyCustomColors(defaultColors);
        Storage.updateSettings({ customColors: defaultColors, colorMode: 'preset' });

        // Switch back to preset mode
        const presetRadio = document.querySelector('input[name="colorMode"][value="preset"]');
        if (presetRadio) {
            presetRadio.checked = true;
            handleColorModeChange({ target: presetRadio });
        }
    };

    /**
     * Export project
     */
    const exportProject = () => {
        if (!currentProjectId) return;

        const json = Storage.exportProject(currentProjectId);
        if (!json) {
            alert('Could not export project');
            return;
        }

        const dataStr = JSON.stringify(JSON.parse(json), null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const project = Storage.getProject(currentProjectId);
        const filename = `${project.name.replace(/\s+/g, '_')}_${new Date().getTime()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', filename);
        linkElement.click();
    };

    /**
     * Delete project
     */
    const deleteProject = () => {
        if (!currentProjectId) return;

        const project = Storage.getProject(currentProjectId);
        if (confirm(`Delete "${project.name}"? This cannot be undone.`)) {
            Storage.deleteProject(currentProjectId);
            closeAllModals();

            const projects = Storage.getProjects();
            if (projects.length > 0) {
                populateProjectSelector();
                loadProject(projects[0].id);
            } else {
                const newProject = Storage.createProject('New Project');
                populateProjectSelector();
                loadProject(newProject.id);
            }
        }
    };

    return {
        init
    };
})();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
