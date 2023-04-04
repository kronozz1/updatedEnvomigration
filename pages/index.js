import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import React from 'react';
import { Swapabi , SwapAddress , Token1abi , Token2abi ,Token1Address , Token2Address} from '../contants';
import Web3Modal from 'web3modal';
import {providers , Contract , BigNumber , utils , ethers} from 'ethers';
export default function Home() {
    const zero = BigNumber.from(0);
  const [walletConnected , setwalletConnected] = React.useState(false)
  const [balanceOfAmanDevTokens ,setbalanceOfAmanDevTokens] = React.useState(zero);
  const [userAddress, setuserAddress]=React.useState();
  const [token1balance , settoken1balance]=React.useState("");
      const [TokenMinted , setTokenMinted] = React.useState(zero);
  const [loading , setloading] = React.useState(false);
  const [ input , setinput] = React.useState();
  const [input2 , setinput2] = React.useState();
  const [bnbBalances , setbnbBalance] = React.useState();
 const [ Enable , setEnable] = React.useState();
  const ModelRef= React.useRef();
  const getSignerOrProvider = async(needSigner = false) =>{
    const provider = await ModelRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const {chainId} = await web3Provider.getNetwork();
    if(chainId != 97){
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
      const contract = new Contract(Token2Address, Token2abi, provider);
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
      const contract = new Contract(Token2Address, Token2abi, provider);
      const balance = await contract.balanceOf(address);
      settoken1balance(ethers.utils.formatUnits(balance));


    }catch(err){
      console.error(err);
    }
  }
const checkApproval = async() =>{
try{
      const provider = await getSignerOrProvider(true);
      const contract = new Contract(Token2Address, Token2abi, provider);
      const amount= ethers.utils.parseEther(input);
        const allowance = await contract.allowance(userAddress, SwapAddress);
        if (allowance.lt(amount)) {
  // Show an error message to the user
  window.alert("Your balance didn't match the amount or You have to give the approval  ");
  console.error("Your balance didn't match the amount or You have to give the approval  ");
  return;
}

}catch(err){
console.error(err);
}
}
  const swapToken1withToken2 = async(event) =>{
    event.preventDefault();
    checkApproval();
    try{
  const signer = await getSignerOrProvider(true);
    const myContract = new Contract(SwapAddress , Swapabi , signer);
    const _tokenMinted = await myContract.buytoken1WithToken2(input);
      console.log(success);

    }catch(err){
      console.error(err);
    }

  }
  const BNBbalance = async() =>{
    try{
            const signer = await getSignerOrProvider(true);
      const address = await signer.getAddress();
    const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545'); // use the appropriate BSC testnet endpoint
const balance = await provider.getBalance(address);
const userbnbBalance = ethers.utils.formatEther(balance);
    setbnbBalance(userbnbBalance);
    }catch(err){
console.error(err);
    }

  }
  console.log(userAddress);
  const connectWallet = async () =>{
    try{
          await getSignerOrProvider();
      setwalletConnected(true);
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
    <title>ENVO migration</title>
    </Head>
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

    <header class="text-gray-600 body-font ">
  <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a class="flex title-font font-medium items-center text-white mb-4 md:mb-0">
      <span class=" text-xl">ENVO Migration</span>
    </a>
    <nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
    <Link href="/reverseSwap" legacyBehavior>
      <a class="mr-5 text-white ">Swap Token2-Token1</a>
    </Link>
    </nav>
    <button onClick={connectWallet} class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"><img className="h-5 w-5 mr-2" src="favicon.png" />{walletConnected ? "Connected" : "Connect Wallet"}
    </button>
  </div>
</header>
    <section class="   body-font relative middle_box">
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
            <label for="name" class=" text-gray-600"><b>Token1</b></label>
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
            <label for="email" class="text-gray-600"><b>Token2</b></label>
			  <div class="input_box">
            <input type="number" id="name" name="name" disabled = {true} class=" w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 transition-colors  duration-200 ease-in-out" placeholder={input} />
          <div class="input_right">
			<img className="h-7 ml-2" src="envo.png" />
			<img className="h-7 ml-2" src="bnb.png" />
            </div>
		  
		  </div>
        </div>
            <div class="p-2 w-full">
              <button type="button" onClick={approval} class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Approve</button>
        </div>

        <div class="p-2 w-full">
          <button type="submit"   class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"> Swap</button>
        </div>
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
                            <a class="btn_right bg-indigo-500"  href="#" target="_blank">ENVO Migration(ENVO) Token Contract</a>
                        </li>
                        <li >
                            <a class="btn_right bg-indigo-500 w70 mr-3"  href="#" target="_blank" >ENVO Migration(GSPV2) Token Contract</a>
							<a href="#" ><img className="h-10 w-10 mr-2" src="favicon.png" /></a>
                        </li>
                        <li>
                            <a class="btn_right bg-indigo-500"  href="#" target="_blank">
                               ENVO Migration Swap Contract (ENVO : GSPV2)
                            </a>
                        </li>
                    </ul>
					
					<ul class="socail-link">
                        <li>
                            <a href="#" target="_blank"><img src="facebook.svg" /></a>
                        </li>
                        <li>
                            <a href="#" target="_blank"> <img src="twitter.svg" alt="twitter"/></a>
                        </li>
                        <li>
                            <a href="#" target="_blank"><img src="instagram.svg" alt="instagram"/></a>
                        </li>
                        <li>
                            <a href="#" target="_blank"><img src="reddit.svg" alt="github"/></a>
                        </li>
                        <li>
                            <a href="#" target="_blank"><img src="telegram.svg" alt="telegram"/></a>
                        </li>
                        <li>
                            <a href="#" target="_blank"><img src="linked-in.svg" alt="reddit"/> </a>
                        </li>
                    </ul>
  </div>
  </div>
  
  
  <div class="reminder-ltl  mb-5">
                        <h3 class="mb-3">Information About Contract</h3>
                        <ul class="">
                            <li>
                                ENVO Migration(ENVO) Token Contract :
                                <a href="javascript:void(0)">0xdCF6773f545c8dA07Bd8A76ds4C56fcBA4De48c46b</a>
                            </li>
                            <li>
                                ENVO Migration(GSPV2) Token Contract :
                                <a href="javascript:void(0)">0xFDe889726DabdEeb8f050605ss48CF7Adb9B35fd3B</a>
                            </li>
                            <li>
                                Swapping Contract ENVO:GSPV2 :
                                <a href="javascript:void(0)">0x3a883f14a8fC5ab4737FeEwsws3Ee827F7E4900b92Eb</a>
                            </li>
                        </ul>
   </div>
   <p class="text-white copy_right">ENVO Migration Swapping Platform.</p>
  
  
  
  
  
  </div>
</section>

    </>
  )
}
