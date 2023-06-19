import Image from 'next/image'
import { Inter } from 'next/font/google'
import { WalletConnection, connect, keyStores } from 'near-api-js';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const login = async () => {
    const config = {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://testnet.mynearwallet.com/",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
    const nearConnection = await connect(config);
    const wallet = new WalletConnection(nearConnection, "g1.calimero-tictactoe.testnet");

    try {
      await wallet.requestSignIn({
        contractId: "g1.calimero-tictactoe.testnet",
        methodNames: ["register_player"],
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function logout() {
    const config = {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://testnet.mynearwallet.com/",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
    const nearConnection = await connect(config);
    const wallet = new WalletConnection(nearConnection, "g1.calimero-tictactoe.testnet");
    try {
      wallet.signOut();
      setLoggedIn(false);
      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const isSigned = async () => {
      const config = {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://testnet.mynearwallet.com/",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
      if (config) {
        const nearConnection = await connect(config);
        const wallet = new WalletConnection(nearConnection, "g1.calimero-tictactoe.testnet");
        const nearSignedIn = await wallet.isSignedInAsync();
        if (nearSignedIn) {
          setLoggedIn(true);
          localStorage.setItem("nearAccountId", wallet.getAccountId());
        }
      }
    };
    isSigned();
  }, []);

  return (
    <div>
      <div className='bg-white text-black px-10 py-2 w-44 mt-20 ml-20 cursor-pointer'
        onClick={loggedIn ? logout : login}
      >{loggedIn ? "logout" : "login"}</div>
    </div>
  )
}
