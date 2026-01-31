import TopNavbar from "./components/TopNavbar";
import { useEffect, useRef, useState } from "react";
import "./Slot.css";

export default function Slot() {
    const [reels, setReels] = useState([[], [], [], [], []]); 
    const [symbolHeight, setSymbolHeight] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const reelRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
    const [authToken, setAuthToken] = useState();
    const visibleSymbols = 4;
    const spinDuration = 2000; 


    // get auth token from local storage on mount
    useEffect(() => {
        setAuthToken(localStorage.getItem("token"));
    }, []);

    // gets the height for each symbol so symbols fit in reels
    // depends on reels so we can update when new data is loaded
    useEffect(() => {
        const calculateSymbolHeight = () => {
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
        };

        calculateSymbolHeight(); // initial calculation on page load
        window.addEventListener("resize", calculateSymbolHeight); // recalculate when window resizes
        return () => window.removeEventListener("resize", calculateSymbolHeight); 
    }, [reels]);


    // handles spins - fetching from backend
    const spin = async () => {
        if (!authToken || spinning) return;
        setSpinning(true);

        try {
        const response = await fetch("/api/betthebracket/slot/spin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ authToken, wager: 10 }),
        });
        if (!response.ok) throw new Error("Bad response from server");
        const data = await response.json();

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


        const timeout = setTimeout(() => setSpinning(false), spinDuration);
        return () => clearTimeout(timeout);
    }, [reels, spinning]); // rerun when reels or spinning changes

    return (
        <div className="slot-page-wrapper">
        <TopNavbar />
        <div className="slot-wrapper">
            <div className="reels-wrapper">
            {reels.map((reelSymbols, idx) => (
                <div className="reel" key={idx} ref={reelRefs[idx]}>
                <div className="reel-strip">
                    {reelSymbols.map((symbol, i) => (
                    <div key={i} className="symbol">
                        {symbol}
                    </div>
                    ))}
                </div>
                </div>
            ))}
            </div>
            <button onClick={spin} disabled={spinning}>
            {spinning ? "Spinning..." : "Spin"}
        </button>
        </div>
        
        </div>
    );
}
