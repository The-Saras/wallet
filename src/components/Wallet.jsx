

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";

function Wallet(props) {
  const [response, setResponse] = useState(null);
  const [amt, setAmt] = useState(0);
  const [wallet, setWallet] = useState("");

  const SendSol = () => {
    const connection = new Connection(
      "https://solana-devnet.g.alchemy.com/v2/g6bihrlVp0mfJByfpOqK15q-QTusXEO2"
    );

    const recipient = new PublicKey(wallet);
    const amount = amt * LAMPORTS_PER_SOL;

    const senderPublicKey = new PublicKey(
      props.publickey
    );

    const privateKeyHex = props.privatekey;
    const privateKeyArray = new Uint8Array(
      privateKeyHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );

    const senderKeypair = Keypair.fromSecretKey(privateKeyArray);

    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: recipient,
        lamports: amount,
      })
    );

    (async () => {
      try {
        const signature = await connection.sendTransaction(transaction, [
          senderKeypair,
        ]);

        console.log("Transaction signature:", signature);
        alert("sent");

        
        const confirmation = await connection.confirmTransaction(signature);
        console.log("Transaction confirmed:", confirmation);
      } catch (err) {
        console.error("Transaction failed:", err);
      }
    })();
  };

  const makeRpcall = async (publicKey) => {
    const url =
      "https://solana-devnet.g.alchemy.com/v2/g6bihrlVp0mfJByfpOqK15q-QTusXEO2";
    const input = {
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [publicKey],
    };
    try {
      const data = await axios.post(url, input);
      setResponse(data.data.result.value);
      console.log(data.data.result.value);
    } catch (error) {
      console.error("Error making JSON-RPC call:", error);
    }
  };
  useEffect(() => {
    makeRpcall(props.publickey);
  }, [props.publickey]);
  return (
    <div>
      <div className="bg-slate-800 text-white p-4 rounded-md border border-slate-700 mb-2">
        <p className="font-bold text-lg">Public Key:</p>
        <p>{props.publickey}</p>
      </div>
      <div className="bg-slate-800 text-white p-4 rounded-md border border-slate-700">
        <p className="font-bold text-lg">Private Key:</p>
        <p>{props.privatekey}</p>
      </div>
      <div className="py-4">
    
        <input
          type="text"
          placeholder="Amount"
          className="text-black  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setAmt(e.target.value)}
        />
      </div>
      <div className="py-2">
    
        <input
          type="text"
          placeholder="Wallet Adress"
          className="text-black  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setWallet(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        onClick={SendSol}
      >
        Send
      </button>

      <p className="font-bold text-lg">Balance: {response / 1_000_000_000}</p>
    </div>
  );
}

export default Wallet;

Wallet.propTypes = {
  publickey: PropTypes.string.isRequired,
  privatekey: PropTypes.string.isRequired,
};
