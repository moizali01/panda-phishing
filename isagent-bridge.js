// isagent-bridge.js
import { isAgent } from '@stytch/is-agent';

// Expose the function to the browser window
window.runIsAgentCheck = async (publicToken) => {
    try {
        const result = await isAgent(publicToken);
        return result;
    } catch (err) {
        console.error("IsAgent check failed:", err);
        return null;
    }
};