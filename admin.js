const { url, publishableKey } = window.BOUNCE_EJ_SUPABASE;
const supabase = window.supabase.createClient(url, publishableKey);
const adminChannel = supabase.channel('admin_control_center');

adminChannel.subscribe();

// Function to lock/unlock any button on all players' screens
function sendButtonCommand(buttonId, isLocked, newText) {
    adminChannel.send({
        type: 'broadcast',
        event: 'lock_button',
        payload: { id: buttonId, locked: isLocked, text: newText }
    });
}

// Example: sendButtonCommand('multiplayerButton', true, 'UPDATING...');
