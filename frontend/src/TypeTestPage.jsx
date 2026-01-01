import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './TypeTestPage.css'

function TypeTestPage() {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [input, setInput] = useState("");
    const [text] = useState(() => getText(words))
    const [timeLeft, setTimeLeft] = useState(60);
    const [running, setRunning] = useState(false);
    const [wordsToType, setWordsToType] = useState(() => getText(words).split(" "));
    const [numWordsTyped, setNumWordsTyped] = useState(0);
    const [errors, setNumErrors] = useState(0);
    const [showResults, setShowResults] = useState(false);
    //const shuffledWords = getText(words);
    const [testOver, setTestOver] = useState(false);
    const [lettersTyped, setLettersTyped] = useState(0);

    {/* start timer on first input or update on each input*/}
    const handleChange = (e) => {
        if (timeLeft === 0) return;
        if (!running) {
            setRunning(true);
        }
        const value = e.target.value;

        if (value.endsWith(" ")) {
            const typedWord = value.trim();
            const firstWord = wordsToType[0];

            if (typedWord === firstWord) {
                setWordsToType(wordsToType.slice(1));
                setNumWordsTyped(numWordsTyped + 1);
            }
            else {
                setWordsToType(wordsToType.slice(1));
                setNumWordsTyped(numWordsTyped + 1);
                
                let wordErrors = 0;
                for (let i = 0; i < typedWord.length; i++) {
                    if (typedWord[i] !== firstWord[i]) {
                        wordErrors++;
                    }
                }
                // count missing letters as an error
                if (typedWord.length < firstWord.length) {
                    wordErrors += firstWord.length - typedWord.length;
                }
                setNumErrors(errors + wordErrors);
            }
            setLettersTyped(lettersTyped + typedWord.length);
            setInput("");
        }
        else {
            setInput(value);
        }
    }

    

    {/* reset test listener */}
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                resetTest();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
    const resetTest = () => {
        setInput("");
        setWordsToType(getText(words).split(" "));
        setTimeLeft(60);
        setRunning(false);
        setNumWordsTyped(0);
        setNumErrors(0);
        setShowResults(false);
        setLettersTyped(0);
    }

    useEffect(() => {
        if (!running) {
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setTestOver(true);
                    setShowResults(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [running]);

    const textRef = useRef(null);

    useEffect(() => {
        if (!textRef.current) {
            return
        }
        textRef.current.scrollLeft = 0;
    }, [wordsToType]);


    return (
        <div>

            <p className='title'>Typing Test</p>
            <button className="back-button" onClick={() => navigate('/home')}>
                <img src="/back-button.png" draggable="false" ></img>
            </button>
            <div className="timer">Time left: {timeLeft}s</div>
            <div className="text" ref={textRef}>
                {wordsToType.map((word, i) => {
                    // highlight the first word
                    const isCurrent = i === 0;
                    let display = word.split("").map((char, j) => {
                        let className = "";
                        if (isCurrent) {
                        if (j < input.length) className = char === input[j] ? "correct" : "error";
                        else if (j === input.length) className = "cursor";
                        }
                        return <span key={j} className={className}>{char}</span>;
                    });
                    return <span key={i}>{display}&nbsp;</span>;
                })}
            </div>

                {/*  silently handles input to update the text div */}
                <input ref={inputRef} className="input" value={input} onChange={handleChange} />
        
            {showResults && (
                <div className="resultsmodal">
                    <div className="modalcontent">
                        <h2>Test Complete!</h2>
                        <p>WPM: {Math.round(numWordsTyped)}</p>
                        <p>Accuracy: {(((lettersTyped - errors) / lettersTyped) * 100).toFixed(2)}%</p>

                        <button className="reset-button-modal" onClick={(resetTest)}>Reset Test</button>
                    </div>
                </div>
            
            )}
        </div>
        
    )
}

function getText(words) {
    const shuffled = [...words]; // create copy


    // shuffle words
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, shuffled.length).join(" ");
}

const words = [
    "and","you","any","the","is","was","of","to","in","it","that","with","as","on","for","at","by","from","not","be","or",
    "an","are","but","if","can","will","do","has","have","about","all","so","what","which","when","how","there","here","then",
    "also","more","up","down","left","right","over","under","through","between","among","after","before","around","over",
    "again","further","once","never","always","maybe","some","each","other","such","first","last","new","old","big","small",
    "long","short","high","low","fast","slow","hot","cold","red","blue","green","yellow","purple","orange","white","black","gray",
    "clear","hard","soft","light","dark","heavy","thin","thick","wide","narrow","deep","shallow","sharp","dull","bright","dark","quiet"
    ,"loud","calm","stormy","happy","sad","angry","excited","bored","scared","brave","kind","mean","smart","dull","funny","serious"
    ,"rich","poor","young","old","fresh","stale","fine","rough","smooth","tasty","bland","clean","dirty","wet","dry","early","late",
    "quick","slow","safe","dangerous","empty","full","open","closed","strong","weak","soft","hard","light","heavy","fair","unfair","cheap",
    "expensive","near","far","long","short","easy","difficult","bright","dark","sharp","flat","round","square","hot","cold","warm","cool",
    "quiet","noisy","fast","slow","simple","complex","empty","full","deep","shallow","fun","boring","good","bad","true","false","right","wrong",
    "first","last","next","previous","above","below","inside","outside","over","under","through","around","between","among","along","across","behind",
    "infront","nearby","furtheraway","today","yesterday","tomorrow","morning","afternoon","evening","night","week","month","year",
    "minute","hour","second","day","moment","while","time","life","world","earth","sky","water","fire","air","stone","rock","sand","tree",
    "flower","leaf","grass","animal","bird","fish","dog","cat","mouse","horse","cow","sheep","pig","elephant","tiger","lion","bear","fox","wolf",
    "monkey","rat","bat","deer","rabbit","frog","snake","lizard","turtle","crocodile","shark","whale","dolphin","octopus","crab","star","moon","sun",
    "cloud","rain","snow","wind","storm","lightning","shadow","leaf","root","branch","trunk","fruit","seed","flower","petal","stem","leaf","bark","grass"
    ,"stone","rock","hill","mountain","valley","river","lake","sea","ocean","beach","sand","shore","cliff","cave","forest","jungle","desert","field","meadow",
    "park","garden","street","road","bridge","building","house","window","door","roof","wall","floor","ceiling","table","chair","bed","sofa","desk","book","pen",
    "pencil","computer","phone","keyboard","mouse","screen","light","lamp","candle","fire","water","food","drink","apple","banana","orange","grape","pear","peach",
    "plum","berry","melon","kiwi","mango","lemon","lime","coconut","avocado","pineapple","papaya","fig","date","pomegranate","passionfruit","guava","nectarine","tangerine",
    "clementine","starfruit","kumquat","olive","prune","walnut","almond","cashew","pistachio","hazelnut","macadamia","pecan","peanut","sesame",
    "chia","flax","sunflower","pumpkin","squash","cucumber","tomato","pepper","carrot","broccoli","cauliflower","spinach","kale","lettuce","celery",
    "radish","onion","garlic","ginger","beet","turnip","parsnip","leek","chard","arugula","brussels","sprout"
]

export default TypeTestPage