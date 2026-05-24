/**
 * Beat Embedder Module
 * Handles embedding of YouTube, Spotify, and SoundCloud beats
 */

const BeatEmbedder = (() => {
    /**
     * Extract YouTube video ID from various URL formats
     */
    const extractYoutubeId = (url) => {
        if (!url) return null;

        // youtube.com/watch?v=ID
        const match1 = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
        if (match1) return match1[1];

        // youtu.be/ID
        const match2 = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
        if (match2) return match2[1];

        // youtube.com/embed/ID
        const match3 = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
        if (match3) return match3[1];

        // Just the ID
        if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

        return null;
    };

    /**
     * Extract Spotify track/playlist ID from URL
     */
    const extractSpotifyId = (url) => {
        if (!url) return null;

        // spotify.com/track/ID or spotify.com/playlist/ID
        const match = url.match(/spotify\.com\/(track|playlist)\/([a-zA-Z0-9?=&]+)/);
        if (match) {
            return {
                type: match[1],
                id: match[2].split('?')[0]
            };
        }

        return null;
    };

    /**
     * Extract SoundCloud track/URL from various formats
     */
    const extractSoundCloudUrl = (url) => {
        if (!url) return null;

        // soundcloud.com/username/track-name
        const match = url.match(/soundcloud\.com\/[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+/);
        if (match) {
            return url;
        }

        // soundcloud.com/username/sets/playlist-name
        const match2 = url.match(/soundcloud\.com\/[a-zA-Z0-9-_]+\/sets\/[a-zA-Z0-9-_]+/);
        if (match2) {
            return url;
        }

        return null;
    };

    /**
     * Validate if URL is a supported beat URL
     */
    const isValidBeatUrl = (url) => {
        if (!url) return false;
        return extractYoutubeId(url) !== null || extractSpotifyId(url) !== null || extractSoundCloudUrl(url) !== null;
    };

    /**
     * Get beat type (youtube, spotify, soundcloud, or unknown)
     */
    const getBeatType = (url) => {
        if (extractYoutubeId(url)) return 'youtube';
        if (extractSpotifyId(url)) return 'spotify';
        if (extractSoundCloudUrl(url)) return 'soundcloud';
        return null;
    };

    /**
     * Create YouTube iframe HTML
     */
    const createYoutubeEmbed = (videoId) => {
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1`;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
        iframe.allowFullscreen = true;
        iframe.style.pointerEvents = 'auto';
        return iframe;
    };

    /**
     * Create Spotify iframe HTML
     */
    const createSpotifyEmbed = (spotifyData) => {
        const container = document.createElement('div');
        const embedUrl = `https://open.spotify.com/embed/${spotifyData.type}/${spotifyData.id}`;

        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = '0';
        iframe.allowTransparency = 'true';
        iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        iframe.style.pointerEvents = 'auto';

        container.appendChild(iframe);
        return container;
    };

    /**
     * Create SoundCloud embed HTML using oEmbed API
     */
    const createSoundCloudEmbed = async (soundcloudUrl) => {
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';

        try {
            // Use SoundCloud oEmbed API
            const oembedUrl = `https://soundcloud.com/oembed?url=${encodeURIComponent(soundcloudUrl)}&format=json&maxheight=315&auto_play=false`;
            const response = await fetch(oembedUrl);
            const data = await response.json();

            if (data.html) {
                container.innerHTML = data.html;
                // Adjust iframe styling
                const iframe = container.querySelector('iframe');
                if (iframe) {
                    iframe.width = '100%';
                    iframe.height = '100%';
                    iframe.style.pointerEvents = 'auto';
                }
                container.style.height = '315px';
                return container;
            }
        } catch (error) {
            console.error('Failed to fetch SoundCloud oEmbed:', error);
        }

        // Fallback: create a simple link if oEmbed fails
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; text-align: center;">
                <a href="${soundcloudUrl}" target="_blank" style="color: var(--primary); text-decoration: none; font-size: 16px;">
                    🎵 Open in SoundCloud
                </a>
                <p style="color: var(--text-secondary); font-size: 12px; margin-top: 8px;">
                    Click to open track
                </p>
            </div>
        `;
        container.style.height = '120px';
        return container;
    };

    /**
     * Create local file embed (audio/video)
     */
    const createLocalFileEmbed = (file, objectUrl) => {
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.overflow = 'hidden';

        const fileType = file.type;

        if (fileType.startsWith('audio/')) {
            const audio = document.createElement('audio');
            audio.src = objectUrl;
            audio.controls = true;
            audio.style.width = '100%';
            audio.style.maxWidth = '100%';
            audio.style.outline = 'none';
            container.appendChild(audio);
        } else if (fileType.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = objectUrl;
            video.controls = true;
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'contain';
            video.style.outline = 'none';
            container.appendChild(video);
        }

        return container;
    };

    /**
     * Embed a beat from URL
     */
    const embedBeat = async (url, containerElement) => {
        if (!url || !containerElement) {
            return {
                success: false,
                error: 'Invalid URL or container'
            };
        }

        // Clear existing content
        containerElement.innerHTML = '';

        const youtubeId = extractYoutubeId(url);
        if (youtubeId) {
            const iframe = createYoutubeEmbed(youtubeId);
            containerElement.appendChild(iframe);
            containerElement.style.height = '315px';
            return {
                success: true,
                type: 'youtube',
                videoId: youtubeId
            };
        }

        const spotifyData = extractSpotifyId(url);
        if (spotifyData) {
            const embed = createSpotifyEmbed(spotifyData);
            containerElement.appendChild(embed);
            containerElement.style.height = '380px';
            return {
                success: true,
                type: 'spotify',
                spotifyData: spotifyData
            };
        }

        const soundcloudUrl = extractSoundCloudUrl(url);
        if (soundcloudUrl) {
            const embed = await createSoundCloudEmbed(soundcloudUrl);
            containerElement.appendChild(embed);
            return {
                success: true,
                type: 'soundcloud',
                url: soundcloudUrl
            };
        }

        return {
            success: false,
            error: 'Unsupported URL format. Please use YouTube, Spotify, or SoundCloud links.'
        };
    };

    /**
     * Embed a local file
     */
    const embedLocalFile = (file, containerElement) => {
        if (!file || !containerElement) {
            return {
                success: false,
                error: 'Invalid file or container'
            };
        }

        // Clear existing content
        containerElement.innerHTML = '';

        const objectUrl = URL.createObjectURL(file);
        const embed = createLocalFileEmbed(file, objectUrl);
        containerElement.appendChild(embed);

        // Set container height based on file type
        if (file.type.startsWith('audio/')) {
            containerElement.style.height = '80px';
        } else if (file.type.startsWith('video/')) {
            containerElement.style.height = '100%';
        }

        return {
            success: true,
            type: 'local',
            fileName: file.name,
            objectUrl: objectUrl
        };
    };

    /**
     * Clear beat embed
     */
    const clearBeat = (containerElement) => {
        if (containerElement) {
            containerElement.innerHTML = '';
            containerElement.style.height = '';
        }
    };

    /**
     * Parse user input and extract beat URL
     */
    const parseUserInput = (input) => {
        if (!input) return null;

        const trimmed = input.trim();

        // Check if it's already a valid URL
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            return trimmed;
        }

        // Check if it looks like a YouTube ID
        if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
            return `https://www.youtube.com/watch?v=${trimmed}`;
        }

        // Check if it's a YouTube short URL
        if (trimmed.startsWith('youtu.be/')) {
            return `https://${trimmed}`;
        }

        // Check if it's a Spotify URL without protocol
        if (trimmed.includes('spotify.com')) {
            if (!trimmed.startsWith('https://')) {
                return `https://${trimmed}`;
            }
            return trimmed;
        }

        // Check if it's a SoundCloud URL without protocol
        if (trimmed.includes('soundcloud.com')) {
            if (!trimmed.startsWith('https://')) {
                return `https://${trimmed}`;
            }
            return trimmed;
        }

        return null;
    };

    /**
     * Get embed HTML for sharing/export
     */
    const getEmbedCode = (beatUrl, type = 'youtube') => {
        if (type === 'youtube') {
            const videoId = extractYoutubeId(beatUrl);
            if (videoId) {
                return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            }
        } else if (type === 'spotify') {
            const spotifyData = extractSpotifyId(beatUrl);
            if (spotifyData) {
                return `<iframe src="https://open.spotify.com/embed/${spotifyData.type}/${spotifyData.id}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
            }
        }
        return '';
    };

    /**
     * Validate beat URL and return detailed info
     */
    const validateAndGetInfo = (url) => {
        const parsed = parseUserInput(url);
        
        if (!parsed) {
            return {
                valid: false,
                error: 'Could not parse URL. Please paste a YouTube, Spotify, or SoundCloud link.'
            };
        }

        const youtubeId = extractYoutubeId(parsed);
        if (youtubeId) {
            return {
                valid: true,
                type: 'youtube',
                url: parsed,
                videoId: youtubeId,
                displayName: `YouTube: ${youtubeId}`
            };
        }

        const spotifyData = extractSpotifyId(parsed);
        if (spotifyData) {
            return {
                valid: true,
                type: 'spotify',
                url: parsed,
                spotifyData: spotifyData,
                displayName: `Spotify: ${spotifyData.type}`
            };
        }

        const soundcloudUrl = extractSoundCloudUrl(parsed);
        if (soundcloudUrl) {
            return {
                valid: true,
                type: 'soundcloud',
                url: parsed,
                displayName: 'SoundCloud Track'
            };
        }

        return {
            valid: false,
            error: 'Unsupported URL format'
        };
    };

    return {
        extractYoutubeId,
        extractSpotifyId,
        extractSoundCloudUrl,
        isValidBeatUrl,
        getBeatType,
        embedBeat,
        embedLocalFile,
        clearBeat,
        parseUserInput,
        getEmbedCode,
        validateAndGetInfo
    };
})();
