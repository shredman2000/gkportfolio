
import {useEffect, React} from 'react';
import './components/betthebracket-bracket.css'; 
import './betthebracket-app.css';
import './betthebracket-auth.css';



function BetTheBracketLayout({ children }) {
    useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
    link.id = 'betthebracket-bootstrap';
    document.head.appendChild(link);

    return () => {
      document.getElementById('betthebracket-bootstrap')?.remove();
    };
  }, []);
  return <div className="betthebracket-root">{children}</div>;
}

export default BetTheBracketLayout;