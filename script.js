// Function to read the URL parameter
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Function to fetch and display the data
async function loadItemData() {
    // Get the ID from the URL
    const itemId = getParameterByName('id');
    if (!itemId) {
        console.error('No item ID provided in the URL.');
        return;
    }

    const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT--3h1L_w64h35K1DOaQtf3vUEx0KPcJOrKpd8_7xt6BaLNMG9OED8IkPeciBGdhtRBx4I_5wgsAcf/pub?gid=801754518&single=true&output=csv'; // Paste your URL here

    try {
        const response = await fetch(sheetURL);
        const csvText = await response.text();
        
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');

        // Find the row with the matching ID
        const targetRow = lines.find(line => {
            const cells = line.split(',');
            return cells[0] === itemId;
        });

        if (!targetRow) {
            console.error('Item not found.');
            document.getElementById('item-name').textContent = 'Item Not Found';
            return;
        }

        const data = targetRow.split(',');

        // Populate the HTML elements with the data
        const item = {};
        headers.forEach((header, index) => {
            item[header] = data[index];
        });

        document.getElementById('item-title').textContent = item['Product Name'];
        document.getElementById('item-name').textContent = item['Product Name'];
        document.getElementById('item-description').textContent = item['Description'];
        document.getElementById('item-image').src = item['Image URL'];

    } catch (error) {
        console.error('Error fetching or parsing data:', error);
    }
}

// Run the function when the page loads
window.onload = loadItemData;