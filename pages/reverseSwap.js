import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React from 'react';
import { Swapabi , SwapAddress , Token2abi ,Token2Address , Token1abi , Token1Address} from '../contants';
import Web3Modal from 'web3modal';
import {ethers, providers , Contract , BigNumber , utils} from 'ethers';
export default function Home() {
    const zero = BigNumber.from(0);
  const [walletConnected , setwalletConnected] = React.useState(false)
  const [balanceOfAmanDevTokens ,setbalanceOfAmanDevTokens] = React.useState(zero);
      const [TokenMinted , setTokenMinted] = React.useState(zero);
  const [loading , setloading] = React.useState(false);
  const [ input , setinput] = React.useState();
  const [input2 , setinput2] = React.useState();
    const [bnbBalances , setbnbBalance] = React.useState();
    const [userAddress, setuserAddress]=React.useState();
  const [token1balance , settoken1balance]=React.useState("");
 const [ Enable , setEnable] = React.useState();

  const ModelRef= React.useRef();
  const getSignerOrProvider = async(needSigner = false) =>{
    const provider = await ModelRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const {chainId} = await web3Provider.getNetwork();
    if(chainId != 56){
      window.alert("Change Your Network to BNB Network");
      throw new Error("Change Your Network to BNB Network");
    }
    if(needSigner ){
      const signer = await web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  }
  const handleChange= async (e) =>{
 setinput(e.target.value);
  }
  console.log(input);


  const getBlanceTokenAmanDevToken = async() =>{
    try{
    const provider = await getSignerOrProvider();
    const myContract = new Contract(SwapAddress , Swapabi , provider);
      const signer = await getSignerOrProvider(true);
      const address = await signer.getAddress();
      setuserAddress(address);

    }catch(err){
      console.error(err);
    }
  }
    const approval= async() =>{
    try{
      const provider = await getSignerOrProvider(true);
      const contract = new Contract(Token1Address, Token1abi, provider);
            const amount= ethers.utils.parseEther(input);
      const balance = await contract.approve(SwapAddress ,amount);
     await balance.wait();
            setEnable(true);
    }catch(err){
      console.error(err);
    }
  }

    const BlanceToken1 = async() =>{
    try{
            const signer = await getSignerOrProvider(true);
      const address = await signer.getAddress();
      const provider = await getSignerOrProvider();
      const contract = new Contract(Token1Address, Token1abi, provider);
      const balance = await contract.balanceOf(address);
      settoken1balance(ethers.utils.formatUnits(balance , 3));
console.log(balance);

    }catch(err){
      console.error(err);
    }
  }
  const BNBbalance = async() =>{
    try{
      const signer = await getSignerOrProvider(true);
      const address = await signer.getAddress();
    const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/'); // use the appropriate BSC testnet endpoint
const balance = await provider.getBalance(address);
const userbnbBalance = ethers.utils.formatEther(balance);
    setbnbBalance(userbnbBalance);


    }catch(err){
      console.error(err);
    }
  }


  const balanceAndAddress = async() =>{
    if(walletConnected){
    await   getBlanceTokenAmanDevToken();
     await BlanceToken1();
await BNBbalance();
    }
  }


  const swapToken1withToken2 = async(event) =>{
    event.preventDefault();
    try{
  const signer = await getSignerOrProvider(true);
    const myContract = new Contract(SwapAddress , Swapabi , signer);
    const _tokenMinted = await myContract.buytoken2WithToken1(input);
      await _tokenMinted.wait();
      window.location.replace("/reverseSwap");

    }catch(err){
            if (err.message.includes('execution reverted: ERC20: insufficient')) {
        window.alert('ERC20: insufficient allowance , please enter the approved input ');
      } 

      console.error(err);
    }

  }

  const connectWallet = async () =>{
    try{
          await getSignerOrProvider();
      setwalletConnected(true);
    }catch(err){
      console.error(err);
    }
  }
  React.useEffect(()=>{
    if(!walletConnected){
      ModelRef.current = new Web3Modal({
        networks:"arbitrum-goerli",
        providerOptions:{},
        disabledInjectedProvider:false,
      })
      connectWallet();
    }
          balanceAndAddress();

  },[walletConnected]);
  return (
    <>
    <Head>
		  <div class="area" >
            <ul class="circles">
                    <li><img src="envo.png"/></li>
                    <li><img src="envo.png"/></li>
                    <li><img src="envo.png"/></li>
                    <li><img src="envo.png"/></li>
                    <li><img src="envo.png"/></li>
                    <li><img src="envo.png"/></li>
                    <li><img src="envo.png"/></li>
                    <li><img src="envo.png"/></li>
                    <li><img src="envo.png"/></li>
			</ul>
			<div id='stars'></div>
			<div id='stars2'></div>
			<div id='stars3'></div>
		</div>

    <title>ENVO migration</title>
    </Head>
    <header class="text-gray-600 body-font">
  <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a class="flex title-font font-medium items-center text-white mb-4 md:mb-0">
      <span class=" text-xl">ENVO Migration</span>
    </a>
    <nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
      <a href="/" class="mr-5 text-white">Swap Token1-Token2</a>
    </nav>
    <button onClick={connectWallet} class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"><img className="h-5 w-5 mr-2" src="favicon.png" />{walletConnected ? "Connected" : "Connect Wallet"}
    </button>
  </div>
</header>

 <section class="body-font relative middle_box">
  <div class="container mx-auto">
    <div class="flex flex-col w-full mb-8">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-white "> ENVO Migration Swap</h1>
      <p class=" leading-relaxed text-white ">Here you can swap Token1 to Token2</p>
    </div>
  <div class="row">
 <div class="box-50">
  <div class="box_white">
    <form onSubmit={swapToken1withToken2}>
                                            <div class="">Wallet Address :<span>{userAddress}</span></div>
	 <div class="value_top">
          <div class="">Token Balance: <span>{token1balance}</span> ENVO</div>
              <div class="ml-auto">
                    BNB Balance: <span>{bnbBalances}</span> BNB
                </div>
          </div>
      <div class="">
        <div class="p-2 w_1_box mb-3">
            <label for="name" class="leading-7 text-gray-600"><b>Token2</b></label>
			<div class="input_box">
            <input type="number" onChange={handleChange} id="name" name="name" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 transition-colors duration-200 ease-in-out" required/>
            <div class="input_right">
			 <b>Max</b>
			 <img className="h-7 ml-2" src="envo.png" />
			 <img className="h-7 ml-2" src="bnb.png" />
            </div>
		  </div>

        </div>
		<p class="mb-2">Swap Rate: 1:1 (1 ENVO=1 GSPV2)</p>
         <div class="p-2 w_1_box mb-2">
            <label for="email" class="leading-7 text-gray-600"><b>Token1</b></label>
			<div class="input_box">
            <input type="number" id="name" name="name" disabled = {true} class=" w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3  transition-colors  duration-200 ease-in-out" placeholder={input} />
             <div class="input_right">
			<img className="h-7 ml-2" src="envo.png" />
			<img className="h-7 ml-2" src="bnb.png" />
            </div>
		 </div>
        </div>
        { !Enable ? 
            <div class="p-2 w-full">
              <button type="button" onClick={approval} class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Approve</button>
        </div>

      : 

        <div class="p-2 w-full">
          <button type="submit"   class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"> Swap</button>
        </div>
    }

		<p class="text-gray-600 text-center mt-1">Powered By ENVO Migration Swap</p>
      </div>
    </form>
    </div>
  </div>
  
  <div class="box-50">
             <ul class="socail-btn">
                        <li>
                            <a class="btn_right bg-indigo-500" href="#" target="_blank">Website</a>
                        </li>
                        <li>
                            <a class="btn_right bg-indigo-500"  href="https://bscscan.com/address/0x1B55B460830CbBD6c6F4EC3dba10352057F1e83D" target="_blank">ENVO Migration(ENVO) Token Contract</a>
                        </li>
                        <li >
                            <a class="btn_right bg-indigo-500 w70 mr-3"  href="https://bscscan.com/address/0x680BFfd5A313da8A3F5a80bcF7132721639eA941" target="_blank" >ENVO Migration(ENVO_V1) Token Contract</a>
							<a href="#" ><img className="h-10 w-10 mr-2" src="favicon.png" /></a>
                        </li>
                        <li>
                            <a class="btn_right bg-indigo-500"  href="https://bscscan.com/address/0xb42fbba5e6bfa29aa36ab7e8be6c369d70161863" target="_blank">
                               ENVO Migration Swap Contract (ENVO_V1 : ENVO)
                            </a>
                        </li>
                    </ul>
					
  </div>
  
  </div>
  
  
  
  
  
  </div>
</section>
    </>
  )
}

