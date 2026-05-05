(function() {
  // Use your provided credentials
  window.BOUNCE_EJ_SUPABASE = {
    url: "https://imhorwdmvhguvsayleqr.supabase.co"
    publishableKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaG9yd2RtdmhndXZzYXlsZXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTQ4MjMsImV4cCI6MjA5MzIzMDgyM30.r0rKsHkIAQ8GrUPCY0rYS1z-8rT7fTGDRJfWU6RSNWM"
  };

  // Initialize the Supabase client
  const supabase = window.supabase.createClient(
    window.BOUNCE_EJ_SUPABASE.url, 
    window.BOUNCE_EJ_SUPABASE.publishableKey
  );

  // Unique ID for this specific tab session
  const myUniqueId = 'EJ-' + Math.random().toString(36).substr(2, 5);
  
  // Join the global lobby to count players
  const lobbyChannel = supabase.channel('global-lobby', {
    config: { presence: { key: myUniqueId } }
  });

  lobbyChannel
    .on('presence', { event: 'sync' }, () => {
      const state = lobbyChannel.presenceState();
      const count = Object.keys(state).length;

      // Update the UI counter element
      const counterLabel = document.getElementById('onlinePlayerCount');
      if (counterLabel) {
        counterLabel.innerText = `${count} Players Online`;
      }
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Start tracking this player session
        await lobbyChannel.track({ online_at: new Date().toISOString() });
      }
    });

  // Attach to window so your other scripts (script.js) can use it
  window.gameSupabase = supabase;
})();
