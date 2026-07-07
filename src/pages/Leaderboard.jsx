import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Spinner, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { TrophyFill, AwardFill, StarFill, PersonCircle, Search, Fire } from 'react-bootstrap-icons';
import axios from 'axios';

const Leaderboard = () => {
    const [players, setPlayers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUserId = localStorage.getItem('eco_fit_userId') || localStorage.getItem('userId');

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const token = localStorage.getItem('eco_fit_token') || localStorage.getItem('token');
                
                // Fetching from social path
                const res = await axios.get('https://ecofit-backend.vercel.app/api/social/leaderboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const rawLeaderboard = res.data.leaderboard || res.data.data || res.data || [];
                setPlayers(rawLeaderboard);
            } catch (err) {
                console.error("Leaderboard fetch error:", err);
                setError("Failed to stream live standing metrics. Please refresh or try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchRankings();
    }, []);

    // FIX: Changed .username to .name to match your MongoDB User model structure
    const filteredPlayers = players.filter(player => 
        (player.name || "Anonymous Athlete").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const podiumPlayers = players.slice(0, 3);

    const getRankDisplay = (index) => {
        switch (index) {
            case 0: return { color: '#FFD700', icon: <TrophyFill size={22} /> };
            case 1: return { color: '#E0E0E0', icon: <AwardFill size={22} /> };
            case 2: return { color: '#CD7F32', icon: <AwardFill size={22} /> };
            default: return { color: '#6c757d', icon: <span className="fw-bold fs-6">{index + 1}</span> };
        }
    };

    if (loading) return (
        <div className="d-flex flex-column justify-content-center align-items-center bg-dark" style={{ minHeight: '90vh' }}>
            <Spinner animation="border" variant="success" style={{ width: '3rem', height: '3rem' }} />
            <p className="text-success mt-3 tracking-widest uppercase small fw-bold">Syncing Network Standings...</p>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#0f1012', minHeight: '100vh' }} className="py-5">
            <Container>
                {/* HERO OVERVIEW */}
                <div className="text-center mb-5 text-white">
                    <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill mb-3 text-uppercase fw-bold tracking-wider">
                        <Fire className="me-1 animate-pulse" /> Live Competition Standings
                    </Badge>
                    <h1 className="fw-black text-uppercase m-0 tracking-tight display-5">Vitality Standings</h1>
                    <p className="text-muted mx-auto mt-2 fs-6" style={{ maxWidth: '500px' }}>
                        Real-time tracking profiles across all active network performance metrics.
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger bg-danger bg-opacity-10 text-danger border-0 rounded-4 p-3 text-center mb-4">
                        {error}
                    </div>
                )}

                {/* VISUAL TOP 3 PODIUM RECOGNITION */}
                {players.length > 0 && !searchQuery && (
                    <Row className="g-4 mb-5 align-items-end justify-content-center text-center text-white">
                        {/* 2nd Place */}
                        {podiumPlayers[1] && (
                            <Col xs={12} md={4} className="order-2 order-md-1">
                                <Card className="border-0 shadow-lg rounded-4 p-3" style={{ background: '#16181c', borderTop: '4px solid #c0c0c0' }}>
                                    <div className="fs-1">🥈</div>
                                    {/* FIX: Changed to .name */}
                                    <h4 className="fw-bold mt-2 mb-1 text-truncate">{podiumPlayers[1].name || "Anonymous Athlete"}</h4>
                                    <span className="text-muted small uppercase tracking-wider block">Rank 2</span>
                                    <div className="mt-3 fs-5 fw-black text-success">
                                        {/* FIX: Absolute baseline conditional rendering fallback */}
                                        {(podiumPlayers[1].vitalityPoints !== undefined ? podiumPlayers[1].vitalityPoints : 100).toLocaleString()} <span className="fs-7 text-muted fw-normal">VP</span>
                                    </div>
                                </Card>
                            </Col>
                        )}
                        {/* 1st Place - Center Stage Highlight */}
                        {podiumPlayers[0] && (
                            <Col xs={12} md={4} className="order-1 order-md-2 mb-md-3">
                                <Card className="border-0 shadow-lg rounded-4 p-4 transform scale-105" style={{ background: '#1c1f26', borderTop: '5px solid #FFD700', boxShadow: '0 10px 30px rgba(0,255,0,0.05)' }}>
                                    <div className="fs-1 animate-bounce">👑</div>
                                    {/* FIX: Changed to .name */}
                                    <h2 className="fw-black mt-2 mb-1 text-truncate text-success">{podiumPlayers[0].name || "Anonymous Athlete"}</h2>
                                    <Badge bg="warning" text="dark" className="fw-black px-3 py-1 uppercase rounded-pill small">Grand Champion</Badge>
                                    <div className="mt-3 fs-3 fw-black" style={{ color: '#FFD700' }}>
                                        {(podiumPlayers[0].vitalityPoints !== undefined ? podiumPlayers[0].vitalityPoints : 100).toLocaleString()} <span className="fs-6 text-muted fw-normal">VP</span>
                                    </div>
                                </Card>
                            </Col>
                        )}
                        {/* 3rd Place */}
                        {podiumPlayers[2] && (
                            <Col xs={12} md={4} className="order-3 order-md-3">
                                <Card className="border-0 shadow-lg rounded-4 p-3" style={{ background: '#16181c', borderTop: '4px solid #cd7f32' }}>
                                    <div className="fs-1">🥉</div>
                                    {/* FIX: Changed to .name */}
                                    <h4 className="fw-bold mt-2 mb-1 text-truncate">{podiumPlayers[2].name || "Anonymous Athlete"}</h4>
                                    <span className="text-muted small uppercase tracking-wider block">Rank 3</span>
                                    <div className="mt-3 fs-5 fw-black text-success">
                                        {(podiumPlayers[2].vitalityPoints !== undefined ? podiumPlayers[2].vitalityPoints : 100).toLocaleString()} <span className="fs-7 text-muted fw-normal">VP</span>
                                    </div>
                                </Card>
                            </Col>
                        )}
                    </Row>
                )}

                {/* SEARCH FILTER */}
                <InputGroup className="mb-4 border-0 rounded-4 overflow-hidden shadow-lg" style={{ background: '#16181c' }}>
                    <InputGroup.Text className="bg-transparent border-0 text-muted ps-4">
                        <Search size={18} />
                    </InputGroup.Text>
                    <Form.Control 
                        type="text" 
                        placeholder="Search athlete profiles..." 
                        className="bg-transparent border-0 text-white py-3 shadow-none custom-placeholder"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </InputGroup>

                {/* RANKING TABLE */}
                <Card className="border-0 shadow-lg rounded-4 bg-dark text-white overflow-hidden">
                    <Card.Body className="p-0">
                        <Table responsive hover variant="dark" className="mb-0 align-middle table-dark-custom">
                            <thead className="bg-secondary bg-opacity-10 text-uppercase small tracking-wider text-muted border-bottom border-secondary border-opacity-20">
                                <tr>
                                    <th className="ps-4 py-3" style={{ width: '10%' }}>Rank</th>
                                    <th className="py-3" style={{ width: '65%' }}>Athlete</th>
                                    <th className="text-end pe-4 py-3" style={{ width: '25%' }}>Total VP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPlayers.length > 0 ? (
                                    filteredPlayers.map((player, index) => {
                                        const rank = getRankDisplay(index);
                                        const isCurrentUser = player._id === currentUserId;

                                        return (
                                            <tr 
                                                key={player._id} 
                                                className="border-bottom border-secondary border-opacity-10 transition-all"
                                                style={{ 
                                                    background: isCurrentUser ? 'rgba(25, 135, 84, 0.08)' : 'transparent',
                                                    borderLeft: isCurrentUser ? '4px solid #198754' : '4px solid transparent'
                                                }}
                                            >
                                                <td className="ps-4 py-3">
                                                    <div className="d-flex align-items-center" style={{ color: rank.color, minHeight: '32px' }}>
                                                        {rank.icon}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center py-1">
                                                        {player.profilePic ? (
                                                            <img src={player.profilePic} alt="avatar" className="rounded-circle me-3 object-fit-cover border border-2 border-opacity-20 border-success" width="42" height="42" />
                                                        ) : (
                                                            <PersonCircle size={42} className="me-3 text-muted border border-2 border-secondary border-opacity-10 rounded-circle" />
                                                        )}
                                                        <div>
                                                            <div className={`fs-6 ${isCurrentUser ? "fw-black text-success" : "fw-bold"}`}>
                                                                {/* FIX: Changed to .name */}
                                                                {player.name || "Anonymous Athlete"} {isCurrentUser && <span className="small text-muted fw-normal ms-1">(You)</span>}
                                                            </div>
                                                            <div className="text-muted small" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                                                ECO-FIT ATHLETE
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <Badge bg={isCurrentUser ? "success" : "secondary"} className="bg-opacity-10 text-success border border-success border-opacity-10 px-3 py-2 rounded-pill font-monospace fw-bold fs-6 shadow-sm">
                                                        {/* FIX: Handled missing vitality fields cleanly during layout passes */}
                                                        {(player.vitalityPoints !== undefined ? player.vitalityPoints : 100).toLocaleString()} <span className="small opacity-50 fw-normal">VP</span>
                                                    </Badge>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-5 text-muted">
                                            No tracking metrics found matching "{searchQuery}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>

            <style>{`
                .fw-black { font-weight: 900 !important; }
                .tracking-wider { letter-spacing: 1px !important; }
                .tracking-tight { letter-spacing: -1px !important; }
                .transition-all { transition: all 0.2s ease-in-out; }
                .table-dark-custom tbody tr:hover { background-color: rgba(255, 255, 255, 0.02) !important; }
                .custom-placeholder::placeholder { color: #535a64 !important; }
                .fs-7 { font-size: 0.75rem !important; }
                @media (min-width: 768px) {
                    .scale-105 { transform: scale(1.05); z-index: 2; }
                }
            `}</style>
        </div>
    );
};

export default Leaderboard;