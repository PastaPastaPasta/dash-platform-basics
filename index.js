import Dash from 'dash';

  async function fetchDPNSNames() {
      const contentDiv = document.getElementById('content');
      contentDiv.innerHTML = 'Loading...';
      const networkSelect = document.getElementById('networkSelect');
      const network = networkSelect.value;
      
      // Prepare client options.
      const clientOptions = { network: network };
      
      if (network === 'mainnet') {
        // For Mainnet, fetch the masternode list
        // (Replace these credentials with your actual ones.)
        const user = "myUser";
        const pass = "myPass";
        try {
          const response = await fetch("https://rpc.digitalcash.dev/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Basic " + btoa(user + ":" + pass)
            },
            body: JSON.stringify({
              method: "masternodelist",
              params: ["evo"]
            })
          });
          if (!response.ok) {
            throw new Error("Failed to fetch masternode list: " + response.status);
          }
          const data = await response.json();
          const masternodeList = data.result || data;
          const addresses = [];
          for (const key in masternodeList) {
            const node = masternodeList[key];
            if (node && node.type === "Evo" && node.platformHTTPPort) {
              const ip = node.address.split(":")[0];
              addresses.push(ip + ":" + node.platformHTTPPort);
            }
          }
          if (addresses.length === 0) {
            contentDiv.innerHTML = 'No valid masternode addresses found.';
            return;
          }
          clientOptions.dapiAddresses = addresses;
          console.log("Masternode addresses:", addresses);
        } catch (e) {
          console.error('Error fetching masternode list:', e);
          contentDiv.innerHTML = 'Failed to load masternode list. Check console for details.';
          return;
        }
      }
      
      try {
        const allDocuments = await fetchAllDPNSNames(clientOptions, network);
        processDocuments(allDocuments);
      } catch (e) {
        console.error("Error fetching all DPNS names:", e);
        contentDiv.innerHTML = 'Failed to load DPNS names. Check console for details.';
      }
    }

    async function fetchAllDPNSNames(clientOptions, network) {
      let allDocuments = [];
      let startAt = undefined;
      const limit = 100;
      
      // Base query options to fetch DPNS documents (parentDomainName = "dash")
      const baseOptions = {
        limit: limit,
        orderBy: [['normalizedLabel', 'asc']],
        where: [['normalizedParentDomainName', '==', 'dash']]
      };

      if (network === 'mainnet') {
        // For Mainnet: retry logic per page
        while (true) {
          const page = await fetchDPNSPageMainnet(clientOptions, startAt, baseOptions);
          if (page.length === 0) break;
          allDocuments = allDocuments.concat(page);

          const lastDocId = page[page.length - 1].getId();
          const newStartAt = Dash.Identifier.from(lastDocId).toBuffer();

          if (startAt && newStartAt.equals(startAt)) {
            console.warn("Pagination marker did not change. Ending loop.");
            break;
          }
          startAt = newStartAt;
        }
      } else {
        // For Testnet: use a single client
        const client = new Dash.Client(clientOptions);
        while (true) {
          const options = Object.assign({}, baseOptions);
          if (startAt !== undefined) options.startAt = startAt;
          const page = await client.platform.documents.get('dpns.domain', options);
          if (page.length === 0) break;
          allDocuments = allDocuments.concat(page);

          const lastDocId = page[page.length - 1].getId();
          const newStartAt = page[page.length - 1];

          if (startAt && newStartAt.equals(startAt)) {
            console.warn("Pagination marker did not change. Ending loop.");
            break;
          }
          startAt = newStartAt;
        }
        client.disconnect();
      }
      return allDocuments;
    }

    async function fetchDPNSPageMainnet(clientOptions, startAt, baseOptions) {
      let page;
      const addresses = clientOptions.dapiAddresses;
      for (let attempt = 1; attempt <= 5; attempt++) {
        console.log(`Attempt ${attempt} with startAt: ${startAt ? startAt.toString('hex') : 'beginning'}`);
        const currentAddress = addresses[attempt - 1] || addresses[0];
        console.log(`Using address ${currentAddress}`);
        
        const tempClient = new Dash.Client({ ...clientOptions, dapiAddresses: [currentAddress] });
        try {
          const options = Object.assign({}, baseOptions);
          if (startAt !== undefined) options.startAt = startAt;
          page = await tempClient.platform.documents.get('dpns.domain', options);
          console.log(`Attempt ${attempt} succeeded. Received ${page.length} documents.`);
          tempClient.disconnect();
          return page;
        } catch (e) {
          console.error(`Attempt ${attempt} failed with address ${currentAddress}:`, e);
          tempClient.disconnect();
        }
      }
      throw new Error("All attempts failed for this page.");
    }

    function processDocuments(documents) {
      const contentDiv = document.getElementById('content');
      contentDiv.innerHTML = '';
      if (documents.length === 0) {
        contentDiv.innerHTML = 'No DPNS names found.';
        return;
      }
      const table = document.createElement('table');
      const header = `<tr><th>Name Label</th><th>Domain</th><th>Owner ID</th></tr>`;
      table.innerHTML = header;
      documents.forEach(doc => {
        const data = doc.getData();
        const identityUrl = `https://platform-explorer.com/identity/${data.records.identity}`;
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${data.label}</td>
          <td>${data.parentDomainName}</td>
          <td><a href="${identityUrl}" target="_blank">${data.records.identity}</a></td>
        `;
        table.appendChild(row);
      });
      contentDiv.appendChild(table);
    }
