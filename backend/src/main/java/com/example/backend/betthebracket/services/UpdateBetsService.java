package com.example.backend.betthebracket.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.betthebracket.models.Bet;
import com.example.backend.betthebracket.models.CBBGame;
import com.example.backend.betthebracket.models.NBAGame;
import com.example.backend.betthebracket.repository.BetRepository;
import com.example.backend.betthebracket.repository.CBBGameRepository;
import com.example.backend.betthebracket.repository.NBAGameRepository;
import com.example.backend.betthebracket.repository.UserRepository;

@Service
public class UpdateBetsService {
    private final BetRepository betRepository;
    private final UserRepository userRepository;
    private final NBAGameRepository nbaGameRepository;
    private final CBBGameRepository cbbGameRepository;


    public UpdateBetsService(BetRepository betRepository, CBBGameRepository cbbGameRepository, UserRepository userRepository, NBAGameRepository nbaGameRepository) {
        this.betRepository = betRepository;
        this.userRepository = userRepository;
        this.nbaGameRepository = nbaGameRepository;
        this.cbbGameRepository = cbbGameRepository;
    }

    public void settleNBABets() {
        List<NBAGame> finishedNBAGames = nbaGameRepository.findByStatus("finished");

        for (NBAGame nbaGame : finishedNBAGames) {
            List<Bet> bets = betRepository.findByGameIdAndSport(nbaGame.getId(), "NBA");

            for (Bet bet : bets) {
                if (!bet.isOpen()) { continue; } // bet is already marked as finished

                if (nbaGame.getWinner().equalsIgnoreCase(bet.getTeamPicked())) {
                    bet.setStatus("won");
                    bet.getUser().setBalance(bet.getUser().getBalance() + bet.getPotentialPay());
                }    
                else {
                    bet.setStatus("lost");
                }

                bet.setOpen(false);
                bet.setOpenOrClosed("closed");
                userRepository.save(bet.getUser());
                betRepository.save(bet); 
            }
        }
    }

    public void settleCBBBets() {
        List<CBBGame> finishedCBBGames = cbbGameRepository.findByStatus("finished");

        for (CBBGame cbbGame : finishedCBBGames) {
            List<Bet> bets = betRepository.findByGameIdAndSport(cbbGame.getId(), "CBB");

            for (Bet bet : bets) {
                if (!bet.isOpen()) { continue; }

                if (cbbGame.getWinner().equalsIgnoreCase(bet.getTeamPicked())) {
                    bet.setStatus("won");
                    bet.getUser().setBalance(bet.getUser().getBalance() + bet.getPotentialPay());
                }
                else {
                    bet.setStatus("lost");
                }
                bet.setOpen(false);
                bet.setOpenOrClosed("closed");
                userRepository.save(bet.getUser());
                betRepository.save(bet);
            }
        }
    }
}
