import React, { useState, useMemo } from 'react';
import { PlusCircle, XCircle, Trash2, Swords, Shield } from 'lucide-react';

// --- Game Configuration ---
const GAMES = {
  DOTA2: {
    key: 'DOTA2',
    name: 'Dota 2',
    rankSystem: 'MMR',
    hasRoles: true,
  },
  CS: {
    key: 'CS',
    name: 'Counter-Strike',
    rankSystem: 'Elo',
    hasRoles: false,
  },
};

// --- Initial Data ---
const initialPlayerPools = {
  DOTA2: [
    { id: 1, name: 'ERROR', rank: 6000, roles: [1, 2] },
    { id: 2, name: 'Shekar', rank: 5400, roles: [1,2,3] },
    { id: 3, name: 'shahri', rank: 5600, roles: [1,2,3] },
    { id: 4, name: 'shahab', rank: 5700, roles: [1,2,3] },
    { id: 5, name: 'dani', rank: 5700, roles: [1,2,3] },
    { id: 6, name: 'amir safe', rank: 6500, roles: [1,2] },
    { id: 7, name: 'iliya', rank: 5500, roles: [1,2,3,4,5] },
    { id: 8, name: 'amir yones', rank: 5800, roles: [3,4,5] },
    { id: 9, name: 'gunner', rank: 4000, roles: [5] },
    { id: 10, name: 'behnam', rank: 4500, roles: [5] },
  ],
  CS: [
    { id: 101, name: 's1mple', rank: 3500, roles: [] },
    { id: 102, name: 'ZywOo', rank: 3400, roles: [] },
    { id: 103, name: 'device', rank: 3000, roles: [] },
    { id: 104, name: 'NiKo', rank: 3100, roles: [] },
    { id: 105, name: 'gla1ve', rank: 2800, roles: [] },
  ],
};

// --- Helper Functions ---
function getCombinations(array, size) {
    const result = [];
    function p(t, i) {
        if (t.length === size) { result.push(t); return; }
        if (i >= array.length) { return; }
        p(t.concat(array[i]), i + 1);
        p(t, i + 1);
    }
    p([], 0);
    return result;
}

// --- Components ---

const Header = () => (
    <header className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-wider">سیستم بالانس تیم</h1>
        <p className="text-gray-400 mt-3 text-lg">ساخته شده توسط BABA ERRØR</p>
    </header>
);

const GameSelector = ({ selectedGame, onGameChange }) => (
    <div className="flex justify-center items-center gap-4 mb-8">
        {Object.values(GAMES).map(game => (
            <button
                key={game.key}
                onClick={() => onGameChange(game.key)}
                className={`flex items-center gap-2 py-2 px-6 rounded-lg text-lg font-bold transition-all duration-300 ${
                    selectedGame === game.key 
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
                {game.key === 'DOTA2' ? <Swords size={20} /> : <Shield size={20} />}
                {game.name}
            </button>
        ))}
    </div>
);

const PlayerCard = ({ player, onAction, actionType, gameConfig }) => (
    <div className="flex items-center justify-between bg-gray-700/60 p-3 rounded-lg">
        <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-100">{player.name}</span>
            <span className="text-cyan-400 font-semibold">{player.rank} {gameConfig.rankSystem}</span>
        </div>
        <div className="flex items-center gap-4">
             {gameConfig.hasRoles && (
                <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(r => (
                        <span key={r} className={`text-xs font-mono px-1.5 py-0.5 rounded ${player.roles.includes(r) ? 'bg-cyan-800 text-cyan-200' : 'bg-gray-600 text-gray-400'}`}>{r}</span>
                    ))}
                </div>
             )}
            <button onClick={() => onAction(player)} className="transition-transform duration-200 hover:scale-110">
                {actionType === 'add' ? <PlusCircle className="text-green-400" /> : <XCircle className="text-red-400" />}
            </button>
        </div>
    </div>
);

const AddPlayerForm = ({ onAddPlayer, gameConfig }) => {
    const [name, setName] = useState('');
    const [rank, setRank] = useState('');
    const [roles, setRoles] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !rank) return;
        
        onAddPlayer({
            id: Date.now(),
            name,
            rank: parseInt(rank, 10),
            roles: gameConfig.hasRoles && roles.length > 0 ? roles : (gameConfig.hasRoles ? [1,2,3,4,5] : [])
        });
        setName('');
        setRank('');
        setRoles([]);
    };
    
    const handleRoleToggle = (role) => {
        setRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 space-y-4">
            <h3 className="text-lg font-bold text-white">افزودن بازیکن جدید</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="نام بازیکن" value={name} onChange={e => setName(e.target.value)} className="bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500" />
                <input type="number" placeholder={gameConfig.rankSystem} value={rank} onChange={e => setRank(e.target.value)} className="bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
             {gameConfig.hasRoles && (
                <div className="roles-group grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2">
                        {[1, 2, 3, 4, 5].map(role => (
                            <label key={role} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                                <input type="checkbox" value={role} checked={roles.includes(role)} onChange={() => handleRoleToggle(role)} className="form-checkbox h-5 w-5 bg-gray-800 border-gray-500 rounded text-cyan-500 focus:ring-cyan-500" />
                                <span className="text-gray-300">پوزیشن {role}</span>
                            </label>
                        ))}
                </div>
            )}
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg transition-all">افزودن به لیست</button>
        </form>
    );
};

const Suggestion = ({ match, index, gameConfig }) => {
    const { teamA, teamB, rankDiff } = match;
    const totalRankA = teamA.reduce((sum, p) => sum + p.rank, 0);
    const totalRankB = teamB.reduce((sum, p) => sum + p.rank, 0);
    const coverageA = gameConfig.hasRoles ? new Set(teamA.flatMap(p => p.roles)).size : null;
    const coverageB = gameConfig.hasRoles ? new Set(teamB.flatMap(p => p.roles)).size : null;

    const TeamCard = ({ title, team, totalRank, coverage }) => (
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-4 text-cyan-400">{title}</h3>
            <ul className="space-y-3 mb-4 flex-grow">
                {team.map(p => (
                    <li key={p.id} className="flex justify-between items-center py-3 px-4 rounded-md bg-gray-700/60">
                        <span className="font-bold text-lg text-gray-200">{p.name}</span>
                        <span className="text-cyan-400 font-semibold">{p.rank}</span>
                    </li>
                ))}
            </ul>
            <div className="border-t border-gray-600 pt-4 mt-auto">
                <div className="flex justify-between items-center"><span className="text-gray-300 font-bold">مجموع {gameConfig.rankSystem}:</span><span className="text-2xl font-bold text-white">{totalRank.toLocaleString()}</span></div>
                {gameConfig.hasRoles && (
                     <div className="flex justify-between items-center mt-2"><span className="text-gray-300 font-bold">پوشش رول‌ها:</span><span className={`text-lg font-bold ${coverage === 5 ? 'text-green-400' : 'text-yellow-400'}`}>{coverage} / 5</span></div>
                )}
            </div>
        </div>
    );

    return (
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <div className="text-center mb-6"><h3 className="text-2xl font-bold text-amber-400">پیشنهاد {index + 1}</h3><p className="text-gray-400 mt-1">اختلاف {gameConfig.rankSystem}: <span className="font-bold text-white">{rankDiff}</span></p></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><TeamCard title="تیم ۱" team={teamA} totalRank={totalRankA} coverage={coverageA} /><TeamCard title="تیم ۲" team={teamB} totalRank={totalRankB} coverage={coverageB} /></div>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
    const [activeGame, setActiveGame] = useState('DOTA2');
    const [playerPools, setPlayerPools] = useState(initialPlayerPools);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const gameConfig = GAMES[activeGame];
    const playerPool = playerPools[activeGame];

    const availablePlayers = useMemo(() => {
        return playerPool.filter(p => !selectedPlayers.some(sp => sp.id === p.id));
    }, [playerPool, selectedPlayers]);

    const handleGameChange = (gameKey) => {
        setActiveGame(gameKey);
        setSelectedPlayers([]);
        setSuggestions([]);
    };

    const handleSelectPlayer = (player) => {
        if (selectedPlayers.length < 10) {
            setSelectedPlayers([...selectedPlayers, player]);
        }
    };

    const handleRemovePlayer = (player) => {
        setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
    };
    
    const handleAddNewPlayer = (newPlayer) => {
        setPlayerPools(prev => ({
            ...prev,
            [activeGame]: [...prev[activeGame], newPlayer]
        }));
    };

    const handleClearPool = () => {
        setPlayerPools(prev => ({
            ...prev,
            [activeGame]: []
        }));
        setSelectedPlayers([]);
    };

    const handleBalanceTeams = () => {
        setIsLoading(true);
        setSuggestions([]);

        setTimeout(() => {
            const firstPlayer = selectedPlayers[0];
            const otherPlayers = selectedPlayers.slice(1);
            const teamACombinations = getCombinations(otherPlayers, 4).map(c => [firstPlayer, ...c]);
            let evaluatedCombos = [];

            for (const teamA of teamACombinations) {
                const teamB = selectedPlayers.filter(p => !teamA.some(pA => pA.id === p.id));
                const rankA = teamA.reduce((sum, p) => sum + p.rank, 0);
                const rankB = teamB.reduce((sum, p) => sum + p.rank, 0);
                const rankDiff = Math.abs(rankA - rankB);
                
                let totalCoverage = 0;
                if(gameConfig.hasRoles) {
                    const getRoles = (p) => (p.roles.length > 0 ? p.roles : [1, 2, 3, 4, 5]);
                    const rolesA = new Set(teamA.flatMap(getRoles));
                    const rolesB = new Set(teamB.flatMap(getRoles));
                    totalCoverage = rolesA.size + rolesB.size;
                }
                
                evaluatedCombos.push({ teamA, teamB, rankDiff, totalCoverage });
            }

            evaluatedCombos.sort((a, b) => {
                if (gameConfig.hasRoles && b.totalCoverage !== a.totalCoverage) {
                    return b.totalCoverage - a.totalCoverage;
                }
                return a.rankDiff - b.rankDiff;
            });

            setSuggestions(evaluatedCombos.slice(0, 10));
            setIsLoading(false);
        }, 100);
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            <div className="max-w-7xl mx-auto">
                <Header />
                <GameSelector selectedGame={activeGame} onGameChange={handleGameChange} />

                <main>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Player Pool Column */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-white">لیست بازیکنان موجود</h2>
                                <button onClick={handleClearPool} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all"><Trash2 size={16} />پاک کردن لیست</button>
                            </div>
                            <AddPlayerForm onAddPlayer={handleAddNewPlayer} gameConfig={gameConfig} />
                            <div className="space-y-3 h-96 overflow-y-auto pr-2">
                                {availablePlayers.map(player => (
                                    <PlayerCard key={player.id} player={player} onAction={handleSelectPlayer} actionType="add" gameConfig={gameConfig} />
                                ))}
                            </div>
                        </div>

                        {/* Selected Players Column */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
                             <h2 className="text-2xl font-bold text-white mb-4">بازیکنان انتخاب شده ({selectedPlayers.length}/10)</h2>
                             <div className="space-y-3 h-[30.5rem] overflow-y-auto pr-2">
                                {selectedPlayers.length > 0 ? selectedPlayers.map(player => (
                                    <PlayerCard key={player.id} player={player} onAction={handleRemovePlayer} actionType="remove" gameConfig={gameConfig} />
                                )) : <p className="text-center text-gray-400 pt-16">بازیکنی انتخاب نشده است.</p>}
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <button onClick={handleBalanceTeams} disabled={isLoading || selectedPlayers.length !== 10} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-12 rounded-lg text-lg transition-all duration-300 shadow-lg shadow-cyan-900/50 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:shadow-none">
                            {isLoading ? 'در حال محاسبه...' : (selectedPlayers.length === 10 ? '🚀 بالانس کن!' : `(${selectedPlayers.length}/10) بازیکن انتخاب شده`)}
                        </button>
                    </div>

                    {isLoading && <div className="text-center text-cyan-400">در حال محاسبه...</div>}

                    {suggestions.length > 0 && (
                         <div className="results-container space-y-12">
                            <h2 className="text-3xl font-bold mb-6 text-center">۱۰ پیشنهاد برتر</h2>
                            {suggestions.map((match, index) => (
                                <Suggestion key={index} match={match} index={index} gameConfig={gameConfig} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
