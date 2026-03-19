// Crossmint Configuration - RewardNFT
// Single Transaction Mint - No Phantom Warning

const API_KEY = process.env.NEXT_PUBLIC_CROSSMINT_API_KEY || '';
const COLLECTION_ID = process.env.NEXT_PUBLIC_CROSSMINT_COLLECTION_ID || '';
const BASE_URL = 'https://www.crossmint.com/api/2022-06-09';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

// Single Transaction Mint Function
export async function mintNFT(walletAddress: string, metadata: NFTMetadata) {
  console.log('Minting NFT for:', walletAddress);
  console.log('Image URL:', metadata.image);

  const response = await fetch(
    `${BASE_URL}/collections/${COLLECTION_ID}/nfts`,
    {
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: `solana:${walletAddress}`,
        metadata: {
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          attributes: metadata.attributes || [],
        },
        compressed: true, // cNFT = Low cost
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error('Crossmint API Error:', error);
    throw new Error(error.message || error.error || 'Mint failed');
  }

  return response.json(); // { id: "cm_..." }
}

// Check Mint Status
export async function checkMintStatus(actionId: string) {
  const response = await fetch(`${BASE_URL}/actions/${actionId}`, {
    headers: {
      'X-API-KEY': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Status check failed');
  }

  return response.json();
}
