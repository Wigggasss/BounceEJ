(function() {
    // 1. Connection using your credentials
    const SB_URL = "https://imhorwdmvhguvsayleqr.supabase.co"
    const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaG9yd2RtdmhndXZzYXlsZXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTQ4MjMsImV4cCI6MjA5MzIzMDgyM30.r0rKsHkIAQ8GrUPCY0rYS1z-8rT7fTGDRJfWU6RSNWM";
    const supabase = window.supabase.createClient(SB_URL, SB_KEY);

    // Generate a unique ID that PERSISTS on refresh to avoid "Ghost Players"
    const myId = sessionStorage.getItem('ej_player_id') || 'EJ-' + Math.random().toString(36).substr(2, 5);
    sessionStorage.setItem('ej_player_id', myId);

    let currentChannel;

    /**
     * SYNC & PRESENCE HANDLER
     * Fixes the "Online" count and lobby state
     */
    function setupPresence(channel) {
        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const players = Object.keys(state);
                const count = players.length;

                // Update ALL Counter UI elements
                document.querySelectorAll('#onlinePlayerCount').forEach(el => el.innerText = count);
                
                // Lobby logic: Only start when exactly 2 players are present
                const countdownEl = document.getElementById('multiplayerLobbyCountdown');
                if (countdownEl) {
                    if (count === 2) {
                        countdownEl.innerText = "Match Ready! Prepare for launch...";
                        countdownEl.classList.add('ready');
                    } else {
                        countdownEl.innerText = "Waiting for an opponent...";
                        countdownEl.classList.remove('ready');
                    }
                }
            })
            .on('presence', { event: 'join' }, ({ newPresences }) => {
                console.log('Player Joined:', newPresences);
            })
            .on('presence', { event: 'leave' }, ({ leftPresences }) => {
                console.log('Player Left:', leftPresences);
            });
    }

    /**
     * ROOM INITIALIZATION
     */
    window.joinOrCreateRoom = async (roomCode) => {
        // Leave previous channel to clear old presence state
        if (currentChannel) await currentChannel.unsubscribe();

        const channelName = `bounceej-duel-${roomCode}`;
        currentChannel = supabase.channel(channelName, {
            config: { presence: { key: myId } }
        });

        setupPresence(currentChannel);

        currentChannel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                // Tracking must happen AFTER subscription to fire the 'sync' event
                await currentChannel.track({ 
                    id: myId, 
                    online_at: new Date().toISOString() 
                });
            }
        });
    };

    // Button Listeners
    document.getElementById('createRoomButton')?.addEventListener('click', () => {
        const code = Math.random().toString(36).substring(2, 7).toUpperCase();
        document.getElementById('multiplayerRoomCode').innerText = code;
        window.joinOrCreateRoom(code);
    });

    window.gameSupabase = supabase;
})();
