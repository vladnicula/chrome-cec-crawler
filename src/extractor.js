/* globals window, document, XMLHttpRequest, alert */

const extractRawContent = () => {
  const table = document.querySelectorAll('table')[0];
  if (!table) {
    throw new Error('Table for invoices not found. Are you on the CEC page?');
  }
  const map = [...table.querySelectorAll('tr')].map(
    row => [
      ...row.querySelectorAll('td'),
    ]
    .map(td => (td.innerText)),
  );

  return map;
};

const extractSold = () => {
  const table = document.querySelectorAll('table')[1];
  if (!table) {
    throw new Error('Table for account details not found. Are you on the CEC page?');
  }
  const map = [...table.querySelectorAll('tr')].map(
    row => [
      ...row.querySelectorAll('td'),
    ]
    .map(td => (td.innerText)),
  );

  return map;
};

const parseExtractedContent = extractedContent => extractedContent.reduce((acc, current, idx) => {
  let item;
  const row = extractedContent[idx];
  if (idx % 2 === 0) {
    item = {
      number: row[0],
      date: row[1],
      valueDate: row[1],
      details: row[2],
      clientRef: row[3],
      bankRef: '',
      ammount: row[4],
      ccy: row[5],
    };
    acc.push(item);
  } else {
    const targetIndex = Math.floor(idx / 2);
    item = acc[targetIndex];
    if (Object.keys(item).length === 0) {
      return acc;
    }
    item = {
      ...item,
      valueDate: row[1] || item.valueDate,
      backRef: row[3] || item.backRef,
    };
    acc[targetIndex] = item;
  }

  return acc;
}, []);

/**
 * [[label, value], [label2, value2]] => {label: value, label2:value2}
 */
const parseAccountDetails = rawData => rawData.map(row => ({
  [row[0].toLowerCase().replace(/ /g, '-')]: row[1],
}));

const apiSend = (url, payload) => new Promise((resolve, reject) => {
  const http = new XMLHttpRequest();
  http.open('POST', url, true);

    // Send the proper header information along with the request
  http.setRequestHeader('Content-Type', 'application/json');

  http.onreadystatechange = function () { // Call a function when the state changes.
    if (http.readyState === 4 && http.status !== 200) {
      alert('There was a problem sending data to the server');
      reject();
    } else {
      resolve();
    }
  };
  http.send(JSON.stringify(payload));
});

window.extractContent = function () {
  const content = extractRawContent();
  const accountDetails = extractSold();
  const parsedTransactionData = [...parseExtractedContent(content).slice(1)];
  const parsedAccountDetails = parseAccountDetails(accountDetails);

  if (!process.env.API_ENDPOINT) {
    alert('This tool needs to be built using a API_ENDPOINT. To build this tool with an API_ENDPOINT run "API_ENDPOINT=your/endpoint/url yarn build"');
  }

  return apiSend(process.env.API_ENDPOINT, {
    parsedAccountDetails,
    parsedTransactionData,
  });
};

