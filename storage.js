/**
 * Storage Management Module
 * Handles local storage of lyric projects and settings
 */

const Storage = (() => {
    const STORAGE_KEY = 'rapzone_projects';
    const SETTINGS_KEY = 'rapzone_settings';
    const BEATS_KEY = 'rapzone_beats';

    // Default settings
    const defaultSettings = {
        theme: 'dark',
        colorMode: 'preset',
        fontFamily: 'Arial, sans-serif',
        fontSize: 16,
        lineHeight: 1.8,
        autoRhymeCheck: false,
        rhymeCompareMode: 'lastWord',
        lineNumbers: false,
        aiRhymeEnabled: false,
        aiApiKey: '',
        customColors: {
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
        }
    };

    /**
     * Get all projects from local storage
     */
    const getProjects = () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading projects from storage:', e);
            return [];
        }
    };

    /**
     * Get a specific project by ID
     */
    const getProject = (projectId) => {
        const projects = getProjects();
        return projects.find(p => p.id === projectId);
    };

    /**
     * Create a new project
     */
    const createProject = (name) => {
        const projects = getProjects();
        const newProject = {
            id: generateId(),
            name: name || `Project ${new Date().toLocaleDateString()}`,
            lyrics: '',
            beatUrl: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        projects.push(newProject);
        saveProjects(projects);
        return newProject;
    };

    /**
     * Update an existing project
     */
    const updateProject = (projectId, updates) => {
        const projects = getProjects();
        const projectIndex = projects.findIndex(p => p.id === projectId);
        
        if (projectIndex === -1) return null;
        
        projects[projectIndex] = {
            ...projects[projectIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        saveProjects(projects);
        return projects[projectIndex];
    };

    /**
     * Delete a project
     */
    const deleteProject = (projectId) => {
        const projects = getProjects();
        const filtered = projects.filter(p => p.id !== projectId);
        saveProjects(filtered);
        return filtered.length < projects.length;
    };

    /**
     * Save all projects to local storage
     */
    const saveProjects = (projects) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
            return true;
        } catch (e) {
            console.error('Error saving projects to storage:', e);
            return false;
        }
    };

    /**
     * Get user settings
     */
    const getSettings = () => {
        try {
            const data = localStorage.getItem(SETTINGS_KEY);
            return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
        } catch (e) {
            return defaultSettings;
        }
    };

    /**
     * Update user settings
     */
    const updateSettings = (updates) => {
        try {
            const current = getSettings();
            const updated = { ...current, ...updates };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
            return updated;
        } catch (e) {
            console.error('Error saving settings:', e);
            return getSettings();
        }
    };

    /**
     * Export a project as JSON
     */
    const exportProject = (projectId) => {
        const project = getProject(projectId);
        if (!project) return null;
        
        return JSON.stringify(project, null, 2);
    };

    /**
     * Import a project from JSON
     */
    const importProject = (jsonString) => {
        try {
            const data = JSON.parse(jsonString);
            if (!data.name || !data.lyrics) {
                throw new Error('Invalid project format');
            }
            
            const project = {
                id: generateId(),
                name: data.name,
                lyrics: data.lyrics,
                beatUrl: data.beatUrl || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            const projects = getProjects();
            projects.push(project);
            saveProjects(projects);
            return project;
        } catch (e) {
            console.error('Error importing project:', e);
            return null;
        }
    };

    /**
     * Generate a unique ID
     */
    const generateId = () => {
        return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    /**
     * Get sample projects for new users
     */
    const getSampleProjects = () => {
        return [
            {
                name: 'Bio',
                lyrics: 'Welcome to RhymeRoom\nWrite your bars, hear your beats, and lay down\nCustomizable, and with rhyme checking, enough features to drown\njust upload your beat and access your desired sound\nAutosave and multiple save slots so you can take yourself around town\n\nI made this software for you, so everything feels right\nwrite in the moment, so rapping ain\'t a fight\nNo worries, no stress, just pure vibes all night\nSuccess is here, now rappin\'s light'
            },
            {
                name: 'Hustle Anthem',
                lyrics: 'Started from the bottom, now we\'re climbing high\nEvery single day just asking myself why\nWhy give up when I\'m so close to the dream?\nFlowing like a river, steady and supreme\n\nGrinding, grinding, never stop the motion\nWords are like weapons, cause a commotion\nPut in the work, gonna see the fruits\nFrom the streets to the stage in my brand new boots'
            },
            {
                name: 'Untitled #1',
                lyrics: ''
            }
        ];
    };

    /**
     * Initialize with sample projects if storage is empty
     */
    const initialize = () => {
        const projects = getProjects();

        // Check if Bio project exists
        const hasBioProject = projects.some(p => p.name === 'Bio');

        // If no projects at all, or Bio is missing, initialize with samples
        if (projects.length === 0 || !hasBioProject) {
            const samples = getSampleProjects();

            // If storage is completely empty, add all samples
            if (projects.length === 0) {
                const initialProjects = samples.map(sample => ({
                    id: generateId(),
                    name: sample.name,
                    lyrics: sample.lyrics,
                    beatUrl: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }));
                saveProjects(initialProjects);
            } else if (!hasBioProject) {
                // If projects exist but Bio is missing, add Bio at the start
                const bioProject = {
                    id: generateId(),
                    name: 'Bio',
                    lyrics: samples[0].lyrics,
                    beatUrl: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                projects.unshift(bioProject);
                saveProjects(projects);
            }
        }
    };

    /**
     * Get all saved beats
     */
    const getBeats = () => {
        try {
            const data = localStorage.getItem(BEATS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading beats from storage:', e);
            return [];
        }
    };

    /**
     * Save a beat to storage
     */
    const saveBeat = (beat) => {
        const beats = getBeats();
        const existingIndex = beats.findIndex(b => b.id === beat.id);

        if (existingIndex !== -1) {
            beats[existingIndex] = { ...beats[existingIndex], ...beat, updatedAt: new Date().toISOString() };
        } else {
            beats.push({
                id: beat.id || generateId(),
                name: beat.name,
                type: beat.type, // 'url' or 'file'
                url: beat.url || '',
                fileName: beat.fileName || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        try {
            localStorage.setItem(BEATS_KEY, JSON.stringify(beats));
            return true;
        } catch (e) {
            console.error('Error saving beat:', e);
            return false;
        }
    };

    /**
     * Delete a beat from storage
     */
    const deleteBeat = (beatId) => {
        const beats = getBeats();
        const filtered = beats.filter(b => b.id !== beatId);
        try {
            localStorage.setItem(BEATS_KEY, JSON.stringify(filtered));
            return true;
        } catch (e) {
            console.error('Error deleting beat:', e);
            return false;
        }
    };

    /**
     * Get a specific beat by ID
     */
    const getBeat = (beatId) => {
        const beats = getBeats();
        return beats.find(b => b.id === beatId);
    };

    return {
        getProjects,
        getProject,
        createProject,
        updateProject,
        deleteProject,
        getSettings,
        updateSettings,
        exportProject,
        importProject,
        initialize,
        generateId,
        getBeats,
        saveBeat,
        deleteBeat,
        getBeat
    };
})();

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Storage.initialize());
} else {
    Storage.initialize();
}
