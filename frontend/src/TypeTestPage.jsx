import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './TypeTestPage.css'

function TypeTestPage() {
    const navigate = useNavigate();

    const shuffledWords = getText(words);
    return (
        <section className='layout'>
            <div className='header'>
                <img src="/back-button.png" draggable="false" onClick={() => navigate('/home')}/> 
            </div>
            <div className='main'>
                <p className='top'>WPM Typing Test</p>
                <div className='middle'>{words}</div>
                
            </div>
            <div className='footer'>
                3
            </div>
        </section>
    )
}

function getText(words) {
    for (let i = words.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [words[i], words[j]] = [words[j], words[i]];
    }
    return words;
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
    "radish","onion","garlic","ginger","beet","turnip","parsnip","leek","chard","endive","arugula","brussels","sprout"
]

export default TypeTestPage