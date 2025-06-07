const contractAddress = "0x3bd63BF8c6b4F402038E9e5225FaB6d17b6694Ca";

const abi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "votecount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "candidatesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getCandidate",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let contract;

async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, abi, signer);

      document.getElementById("status").innerText = "Wallet connected!";
      document.getElementById("voteBtn").disabled = false;

      loadCandidate();
    } catch (err) {
      console.error(err);
      document.getElementById("status").innerText = "Failed to connect wallet.";
    }
  } else {
    alert("MetaMask is not installed!");
  }
}

async function loadCandidate() {
  try {
    const count = await contract.candidatesCount();
    if (count.toNumber() === 0) {
      document.getElementById("candidateName").innerText = "No candidates";
      document.getElementById("voteCount").innerText = "0";
      return;
    }

    const candidate = await contract.candidates(0);
    document.getElementById("candidateName").innerText = candidate.name;
    document.getElementById("voteCount").innerText = candidate.votecount.toString();
  } catch (err) {
    console.error("Error loading candidate", err);
  }
}

async function vote() {
  try {
    const userAddress = await signer.getAddress();
    const hasVoted = await contract.hasVoted(userAddress);
    if (hasVoted) {
      alert("You have already voted.");
      return;
    }

    const tx = await contract.vote(0); // Vote for candidate ID 0
    await tx.wait();
    alert("Vote successful!");
    loadCandidate();
  } catch (err) {
    console.error(err);
    alert("Voting failed.");
  }
} 
document.getElementById("connectBtn").addEventListener("click", connectWallet);
document.getElementById("voteBtn").addEventListener("click", vote);