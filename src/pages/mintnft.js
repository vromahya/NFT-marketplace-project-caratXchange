// async function onChange(e) {
//   const file = e.target.files[0];
//   try {
//     const added = await client.add(file, {
//       progress: (prog) => console.log(`received: ${prog}`),
//     });
//     const url = `https://ipfs.infura.io/ipfs/${added.path}`;
//     setFileUrl(url);
//   } catch (error) {
//     console.log('Error uploading file: ', error);
//   }
// }
// async function uploadToIPFS() {
//   const { name, description, price } = formInput;
//   if (!name || !description || !price || !fileUrl) return;
//   /* first, upload to IPFS */
//   const data = JSON.stringify({
//     name,
//     description,
//     image: fileUrl,
//   });
//   try {
//     const added = await client.add(data);
//     const url = `https://ipfs.infura.io/ipfs/${added.path}`;
//     /* after file is uploaded to IPFS, return the URL to use it in the transaction */
//     return url;
//   } catch (error) {
//     console.log('Error uploading file: ', error);
//   }
// }
// async function listNFTForDirectSale() {
//   const url = await uploadToIPFS();
//   const web3Modal = new Web3Modal();
//   const connection = await web3Modal.connect();
//   const provider = new ethers.providers.Web3Provider(connection);
//   const signer = provider.getSigner();

//   /* next, create the item */
//   const price = ethers.utils.parseUnits(formInput.price, 'ether');
//   let contract = new ethers.Contract(
//     nftMarketAddress,
//     nftMarketAddress.abi,
//     signer
//   );

//   let transaction = await contract.mintToken(url);
//   await transaction.wait();

//   let event = transaction.event[0];
//   let value = event.args[2];
//   let tokenId = value.toNumber();

//   let createDirectSale = await contract.createDirectSale(tokenId, price);
//   await createDirectSale.wait();
// }

// async function listNFTForAuction() {
//   const url = await uploadToIPFS();
//   const web3Modal = new Web3Modal();
//   const connection = await web3Modal.connect();
//   const provider = new ethers.providers.Web3Provider(connection);
//   const signer = provider.getSigner();

//   /* next, create the item */
//   const price = ethers.utils.parseUnits(formInput.price, 'ether');
//   let contract = new ethers.Contract(
//     nftMarketAddress,
//     nftMarketAddress.abi,
//     signer
//   );

//   let transaction = await contract.mintToken(url);
//   await transaction.wait();

//   let event = transaction.event[0];
//   let value = event.args[2];
//   let tokenId = value.toNumber();
// }
