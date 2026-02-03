import TopNavbar from "./components/TopNavbar";
import { useEffect, useRef, useState, useLayoutEffect, } from "react";
import Select from 'react-select';
import "./Slot.css";
import BasketballSymbol from './assets/BasketballSymbol.png';
import TwoPtSymbol from './assets/2pt-symbol.png';
import ThreePtSymbol from './assets/3pt-symbol.png';
import HoopSymbol from './assets/HoopSymbol.png';
import Logo from './assets/LogoGK.png'


export default function Slot({ setToken }) {
    const [reels, setReels] = useState([[], [], [], [], []]); 
    const [symbolHeight, setSymbolHeight] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [layoutReady, setLayoutReady] = useState(false);
    const reelRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
    const [authToken, setAuthToken] = useState();
    const visibleSymbols = 4;
    const spinDuration = 2000; 
    const [data, setData] = useState(null);
    const [pendingBalance, setPendingBalance] = useState(null);
    const [displayedBalance, setDisplayedBalance] = useState(null);
    const [spinWin, setSpinWin] = useState(null);
    const [showWin, setShowSpinWin] = useState(false);
    
    

    const placeHolderSymbols = [
        ["A", "K", "GK", "K"],
        ["J", "Q", "GK", "J"],
        ["Q", "GK", "K", "K"],
        ["A", "J", "Q", "J"],
        ["GK", "K", "J", "A"]
    ];

    const SYMBOL_MAP = {
        A: BasketballSymbol,
        J: HoopSymbol,
        Q: TwoPtSymbol,
        K: ThreePtSymbol,   
        GK: Logo,
    };

    const options = [
        { value: 1, label: "$1" },
        { value: 2, label: "$2" },
        { value: 5, label: "$5" },
        { value: 10, label: "$10" },
        { value: 50, label: "$50" },
        { value: 100, label: "$100" },
        { value: 250, label: "$250" },
        { value: 500, label: "$500" },
        { value: 1000, label: "$1000" },
    ];
    const [selectedWager, setSelectedWager] = useState(options[3]);

    // get auth token from local storage on mount
    useEffect(() => {
        setAuthToken(localStorage.getItem("token"));
        setReels(placeHolderSymbols);

        fetch('/api/betthebracket/users/getUsernameAndBalance', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ authToken: localStorage.getItem('token') })
        })
        .then(res => res.json())
        .then(data => {setDisplayedBalance(data.balance)})
    }, []);

    // gets the height for each symbol so symbols fit in reels
    // depends on reels so we can update when new data is loaded
    // waits for page layout to be defined before calculating reel height.
    useLayoutEffect(() => {
        if (!reelRefs[0].current) return;

        const reelHeight = reelRefs[0].current.clientHeight;
        const height = reelHeight / visibleSymbols;
        setSymbolHeight(height);


        reelRefs.forEach((ref) => {
            if (!ref.current) return;
            Array.from(ref.current.children[0].children).forEach((symbol) => {
                symbol.style.height = `${height}px`;
                symbol.style.flex = `0 0 ${height}px`;
            });
        });

        setLayoutReady(true);
    }, [reels]);


    // handles spins - fetching from backend
    const spin = async () => {
        if (!authToken || spinning) return;
        setSpinning(true);
        setShowSpinWin(false);
        try {
            const response = await fetch("/api/betthebracket/slot/spin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ authToken, wager: selectedWager.value }),
            });
            if (!response.ok) throw new Error("Bad response from server");
            const data = await response.json();
            setPendingBalance(data.userBalance);
            setSpinWin(data.payout);
            setReels(data.reels); 
        } catch (e) {
        console.error("Network error:", e);
        setSpinning(false);
        }
    };


    // animates reels when spinning is triggered
    useEffect(() => {
        if (!spinning) return;

        reelRefs.forEach((ref, i) => {
            const reel = ref.current;
            const symbolCount = reels[i].length;

            // how far the reel should go so the last 4 symbols are shown
            const landingOffset = (symbolCount - visibleSymbols) * symbolHeight;

            // reset the transform
            reel.children[0].style.transition = "none";
            reel.children[0].style.transform = `translateY(0px)`;

            // reel spin animation - bezier might need tweaking to spin like a real slot
            requestAnimationFrame(() => {

                reel.children[0].style.transition = `transform ${spinDuration}ms cubic-bezier(.17, .67, .35, 1.02)`;

                reel.children[0].style.transform = `translateY(-${landingOffset}px)`;
            });
        });


        const timeout = setTimeout(() => {
            setSpinning(false);
            if (pendingBalance !== null) {
                setDisplayedBalance(pendingBalance);
                setShowSpinWin(true);
            }
        }, spinDuration);
        return () => clearTimeout(timeout);
    }, [reels, spinning, symbolHeight]); // rerun when reels or spinning changes

    return (
        <div className="slot-page-wrapper">

            <TopNavbar setToken={setToken} />
            <div className="slot-wrapper">
                <div className="reels-wrapper">
                {reels.map((reelSymbols, idx) => (
                    <div className="reel" key={idx} ref={reelRefs[idx]}>
                    <div className="reel-strip">
                        {reelSymbols.map((symbol, i) => (
                        <div key={i} className="symbol">
                            {SYMBOL_MAP[symbol] ? (
                                <img src={SYMBOL_MAP[symbol]} alt={symbol} className="slot-symbol-img"/>
                            ) : ( symbol )}
                        </div>
                        ))}
                    </div>
                    </div>
                ))}
                </div>
                <button onClick={spin} disabled={spinning} style={{ marginTop: '10px', width: '15%'}}>
                    {spinning ? "Spinning..." : "Spin"}
                </button>
                <div className="slot-settings-div">
                    <h2 style={{color: 'white'}}>Win: {showWin && spinWin}</h2>
                    <h2 style={{color: 'white'}}>Balance: {displayedBalance?.toFixed(2)}</h2>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <h2 style={{color: 'white'}}>Wager</h2>
                        <Select options={options} menuPlacement="top" value={selectedWager} onChange={(option) => setSelectedWager(option)}></Select>
                    </div>
                    
                </div>
            </div>
        
        </div>
    );
}
