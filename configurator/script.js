// Chat Widget Configurator JavaScript

// Global Variables
let isOpen = false;
let selectedPosition = 'right';

// DOM Elements
const elements = {};

// Initialize Application
function initializeApp() {
    console.log('Initializing Chat Widget Configurator...');
    cacheElements();
    setupEventListeners();
    updatePreview();
}

// Cache DOM Elements
function cacheElements() {
    elements.widgetPreview = document.getElementById('widgetPreview');
    elements.chatWindow = document.getElementById('chatWindow');
    elements.chatButton = document.getElementById('chatButton');
    elements.chatHeader = document.getElementById('chatHeader');
    elements.chatBody = document.getElementById('chatBody');
    elements.sendBtn = document.getElementById('sendBtn');
    elements.chatLogo = document.getElementById('chatLogo');
    elements.previewCompanyName = document.getElementById('previewCompanyName');
    elements.previewResponseTime = document.getElementById('previewResponseTime');
    elements.previewWelcomeMessage = document.getElementById('previewWelcomeMessage');
    elements.generateBtn = document.getElementById('generateBtn');
    elements.copyBtn = document.getElementById('copyBtn');
    elements.codeOutput = document.getElementById('codeOutput');
}

// Event Listeners Setup
function setupEventListeners() {
    // Color input event listeners
    setupColorInputs();
    
    // Text input event listeners
    setupTextInputs();
    
    // Position selector event listeners
    setupPositionSelector();
    
    // Button event listeners
    setupButtonListeners();
}

// Setup Color Input Event Listeners
function setupColorInputs() {
    const colorInputs = ['primaryColor', 'secondaryColor', 'backgroundColor', 'fontColor'];
    
    colorInputs.forEach(function(id) {
        const input = document.getElementById(id);
        const valueSpan = document.getElementById(id + 'Value');
        
        if (input && valueSpan) {
            input.addEventListener('input', function() {
                valueSpan.textContent = this.value;
                updatePreview();
            });
        }
    });
}

// Setup Text Input Event Listeners
function setupTextInputs() {
    const textInputs = ['companyName', 'welcomeText', 'responseTime', 'logoUrl', 'webhookUrl', 'webhookRoute'];
    
    textInputs.forEach(function(id) {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updatePreview);
        }
    });
}

// Setup Position Selector Event Listeners
function setupPositionSelector() {
    const positionOptions = document.querySelectorAll('.position-option');
    
    positionOptions.forEach(function(option) {
        option.addEventListener('click', function() {
            // Remove active class from all options
            positionOptions.forEach(function(opt) {
                opt.classList.remove('active');
            });
            
            // Add active class to clicked option
            this.classList.add('active');
            selectedPosition = this.dataset.position;
            updatePreview();
        });
    });
}

// Setup Button Event Listeners
function setupButtonListeners() {
    // Generate button
    if (elements.generateBtn) {
        elements.generateBtn.addEventListener('click', generateCode);
    }
    
    // Copy button
    if (elements.copyBtn) {
        elements.copyBtn.addEventListener('click', copyCode);
    }
    
    // Chat button
    if (elements.chatButton) {
        elements.chatButton.addEventListener('click', toggleChat);
    }
}

// Update Preview Function
function updatePreview() {
    const config = getConfigurationData();
    updateWidgetPosition(config);
    updateWidgetColors(config);
    updateWidgetContent(config);
}

// Update Widget Position
function updateWidgetPosition(config) {
    if (elements.widgetPreview && elements.chatWindow) {
        elements.widgetPreview.className = 'widget-preview ' + selectedPosition;
        elements.chatWindow.className = 'chat-window ' + selectedPosition;
        
        // If chat is open, maintain the open state
        if (isOpen) {
            elements.chatWindow.classList.add('open');
        }
    }
}

// Update Widget Colors
function updateWidgetColors(config) {
    const primaryColor = config.style.primaryColor;
    const secondaryColor = config.style.secondaryColor;
    const gradient = 'linear-gradient(135deg, ' + primaryColor + ' 0%, ' + secondaryColor + ' 100%)';

    if (elements.chatButton) {
        elements.chatButton.style.background = gradient;
    }
    
    if (elements.chatHeader) {
        elements.chatHeader.style.background = gradient;
    }
    
    if (elements.chatBody) {
        elements.chatBody.style.backgroundColor = config.style.backgroundColor;
        elements.chatBody.style.color = config.style.fontColor;
    }
    
    if (elements.sendBtn) {
        elements.sendBtn.style.background = primaryColor;
    }
    
    // Update the n8n link color to use primary color
    const n8nLink = document.querySelector('.configurator .chat-footer .n8n-link');
    if (n8nLink) {
        n8nLink.style.color = primaryColor;
    }
}

// Update Widget Content
function updateWidgetContent(config) {
    if (elements.previewCompanyName) {
        elements.previewCompanyName.textContent = config.branding.name;
    }
    
    if (elements.previewResponseTime) {
        elements.previewResponseTime.textContent = config.branding.responseTimeText;
    }
    
    if (elements.previewWelcomeMessage) {
        elements.previewWelcomeMessage.textContent = config.branding.welcomeText;
    }
    
    if (elements.chatLogo) {
        if (config.branding.logo) {
            elements.chatLogo.innerHTML = '<img src="' + escapeHtml(config.branding.logo) + '" alt="Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">';
        } else {
            elements.chatLogo.textContent = config.branding.name.substring(0, 2).toUpperCase();
        }
    }
}

// Toggle Chat Window
function toggleChat() {
    if (!elements.chatWindow) return;
    
    isOpen = !isOpen;
    
    if (isOpen) {
        elements.chatWindow.classList.add('open');
    } else {
        elements.chatWindow.classList.remove('open');
    }
}

// Get Configuration Data
function getConfigurationData() {
    return {
        webhook: {
            url: getInputValue('webhookUrl'),
            route: getInputValue('webhookRoute') || 'general'
        },
        branding: {
            logo: getInputValue('logoUrl'),
            name: getInputValue('companyName') || 'Your Company',
            welcomeText: getInputValue('welcomeText') || 'Hi 👋, how can we help?',
            responseTimeText: getInputValue('responseTime') || 'We typically respond right away'
        },
        style: {
            primaryColor: getInputValue('primaryColor') || '#854fff',
            secondaryColor: getInputValue('secondaryColor') || '#6b3fd4',
            position: selectedPosition,
            backgroundColor: getInputValue('backgroundColor') || '#ffffff',
            fontColor: getInputValue('fontColor') || '#333333'
        }
    };
}

// Helper function to get input values
function getInputValue(id) {
    const input = document.getElementById(id);
    return input ? input.value : '';
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Generate Widget Code
function generateCode() {
    console.log('Generating code...');
    const config = getConfigurationData();
    const code = buildWidgetCode(config);
    displayGeneratedCode(code);
}

// Build Widget Code String
function buildWidgetCode(config) {
    return [
        '<!-- Chat Widget Configuration -->',
        '<script>',
        '    window.ChatWidgetConfig = {',
        '        webhook: {',
        '            url: \'' + escapeString(config.webhook.url) + '\',',
        '            route: \'' + escapeString(config.webhook.route) + '\'',
        '        },',
        '        branding: {',
        '            logo: \'' + escapeString(config.branding.logo) + '\',',
        '            name: \'' + escapeString(config.branding.name) + '\',',
        '            welcomeText: \'' + escapeString(config.branding.welcomeText) + '\',',
        '            responseTimeText: \'' + escapeString(config.branding.responseTimeText) + '\'',
        '        },',
        '        style: {',
        '            primaryColor: \'' + escapeString(config.style.primaryColor) + '\',',
        '            secondaryColor: \'' + escapeString(config.style.secondaryColor) + '\',',
        '            position: \'' + escapeString(config.style.position) + '\',',
        '            backgroundColor: \'' + escapeString(config.style.backgroundColor) + '\',',
        '            fontColor: \'' + escapeString(config.style.fontColor) + '\'',
        '        }',
        '    };',
        '</script>',
        '<script src="https://cdn.jsdelivr.net/gh/carlosvargasvip/n8n-chat-bot@1.0.0/chatbot-widget.js"></script>',
        '<!-- End Chat Widget -->'
    ].join('\n');
}

// Helper function to escape strings for JavaScript
function escapeString(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// Display Generated Code
function displayGeneratedCode(code) {
    if (elements.codeOutput && elements.copyBtn) {
        elements.codeOutput.textContent = code;
        elements.codeOutput.style.display = 'block';
        elements.copyBtn.style.display = 'inline-block';
        
        // Scroll to code output
        elements.codeOutput.scrollIntoView({ behavior: 'smooth' });
    }
}

// Copy Code to Clipboard
function copyCode() {
    if (!elements.codeOutput || !elements.copyBtn) return;
    
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(elements.codeOutput.textContent)
            .then(function() {
                showCopySuccess(elements.copyBtn);
            })
            .catch(function() {
                fallbackCopyMethod(elements.codeOutput, elements.copyBtn);
            });
    } else {
        fallbackCopyMethod(elements.codeOutput, elements.copyBtn);
    }
}

// Fallback copy method for older browsers
function fallbackCopyMethod(codeOutput, copyBtn) {
    const textArea = document.createElement('textarea');
    textArea.value = codeOutput.textContent;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(copyBtn);
    } catch (err) {
        console.error('Copy failed:', err);
        alert('Copy failed. Please manually select and copy the code.');
    }
    
    document.body.removeChild(textArea);
}

// Show copy success feedback
function showCopySuccess(copyBtn) {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✅ Copied!';
    copyBtn.classList.add('copied');
    
    setTimeout(function() {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('copied');
    }, 2000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeApp);

// Also initialize on window load as fallback
window.addEventListener('load', function() {
    // Only initialize if not already done
    if (!elements.widgetPreview) {
        initializeApp();
    }
});
