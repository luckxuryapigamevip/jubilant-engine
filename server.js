// ============================================================
// VIP TOOL LC79 - FULL BACKEND (VÁ LỖI KẾT NỐI WSS + LOG)
// ============================================================
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { io } = require('socket.io-client');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const ioServer = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// ============================================================
// 1. THUẬT TOÁN AI REALBRAIN ULTRA
// ============================================================
class RealBrainUltra {
    constructor() {
        this.results = [];
        this.sums = [];
        this.perf = [];
        this.pattern_memory = {};
        this.pattern_total = {};
        this.streak_memory = {};
        this.markov_chain = {};
        this.transition_matrix = {};
        this.super_pattern = {};
        this.ngram_weights = { 2: 0.08, 3: 0.15, 4: 0.25, 5: 0.32, 6: 0.20 };
        this.adaptive_threshold = 0.58;
        this.volatility = [];
        this.trend_strength = 0.0;
    }

    push(data) {
        for (let h of data) {
            let res = (typeof h === 'object') ? h.result : h;
            if (!res) continue;
            let s = String(res).toUpperCase();
            if (s.includes('TÀI') || s === 'TAI' || s === 'T') this.results.push('TAI');
            else if (s.includes('XỈU') || s === 'XIU' || s === 'X') this.results.push('XIU');
            else this.results.push(res);
            if (typeof h === 'object' && h.total !== undefined) this.sums.push(h.total);
            else this.sums.push(10);
        }
        if (this.results.length > 2000) {
            this.results = this.results.slice(-2000);
            this.sums = this.sums.slice(-2000);
        }
    }

    learn() {
        const all_res = this.results;
        const n = all_res.length;
        if (n < 15) return;

        this.pattern_memory = {}; this.pattern_total = {}; this.markov_chain = {};
        this.transition_matrix = {}; this.super_pattern = {};

        for (let i = 0; i < n; i++) {
            for (let plen of [2, 3, 4, 5, 6]) {
                if (i >= plen) {
                    let pat = all_res.slice(i - plen, i).join(',');
                    let nxt = all_res[i];
                    if (!this.pattern_memory[pat]) this.pattern_memory[pat] = {};
                    this.pattern_memory[pat][nxt] = (this.pattern_memory[pat][nxt] || 0) + 1;
                    this.pattern_total[pat] = (this.pattern_total[pat] || 0) + 1;
                }
            }
            if (i >= 1) {
                let k = all_res[i - 1];
                if (!this.markov_chain[k]) this.markov_chain[k] = {};
                let nxt = all_res[i];
                this.markov_chain[k][nxt] = (this.markov_chain[k][nxt] || 0) + 1;
            }
            if (i >= 2) {
                let k = all_res[i - 2] + ',' + all_res[i - 1];
                if (!this.transition_matrix[k]) this.transition_matrix[k] = {};
                let nxt = all_res[i];
                this.transition_matrix[k][nxt] = (this.transition_matrix[k][nxt] || 0) + 1;
            }
            if (i >= 4) {
                let k = all_res.slice(i - 4, i).join(',');
                if (!this.super_pattern[k]) this.super_pattern[k] = {};
                let nxt = all_res[i];
                this.super_pattern[k][nxt] = (this.super_pattern[k][nxt] || 0) + 1;
            }
        }

        this.streak_memory = {};
        let i = 0;
        while (i < n) {
            let last = all_res[i];
            let s = 1, j = i + 1;
            while (j < n && all_res[j] === last) { s++; j++; }
            if (j < n) {
                let nxt = all_res[j];
                if (!this.streak_memory[s]) this.streak_memory[s] = { THEO: 0, BE: 0 };
                if (nxt === last) this.streak_memory[s].THEO++;
                else this.streak_memory[s].BE++;
            }
            i = j;
        }

        if (all_res.length >= 20) {
            let recent = all_res.slice(-20);
            let t = recent.filter(x => x === 'TAI').length;
            let x = recent.filter(x => x === 'XIU').length;
            this.trend_strength = (t - x) / 20;
        }

        if (all_res.length >= 10) {
            let recent50 = all_res.slice(-50);
            let changes = 0;
            for (let k = 1; k < recent50.length; k++) if (recent50[k] !== recent50[k - 1]) changes++;
            this.volatility.push(changes / recent50.length);
            if (this.volatility.length > 100) this.volatility.shift();
        }
    }

    quantum_analysis(r) {
        if (r.length < 20) return null;
        let recent = r.slice(-20);
        let t = recent.filter(x => x === 'TAI').length;
        let x = recent.filter(x => x === 'XIU').length;
        let ratio = t / (t + x);
        if (ratio > 0.75) return ['XIU', 0.87, `Quantum đảo TÀI`];
        if (ratio < 0.25) return ['TAI', 0.87, `Quantum đảo XỈU`];
        return null;
    }

    fibonacci_analysis(r) {
        if (r.length < 21) return null;
        let fibs = [1, 2, 3, 5, 8, 13, 21];
        let w = [];
        for (let f of fibs) {
            if (r.length >= f) {
                let seg = r.slice(-f);
                let t = seg.filter(x => x === 'TAI').length;
                let x = seg.filter(x => x === 'XIU').length;
                w.push((t - x) / f);
            }
        }
        let sumW = 0, sumI = 0;
        w.forEach((val, idx) => { sumW += val * (idx + 1); sumI += (idx + 1); });
        let score = sumW / sumI;
        if (score > 0.3) return ['TAI', Math.min(0.90, 0.62 + Math.abs(score) * 0.30), `Fibonacci TÀI`];
        if (score < -0.3) return ['XIU', Math.min(0.90, 0.62 + Math.abs(score) * 0.30), `Fibonacci XỈU`];
        return null;
    }

    entropy_analysis(r) {
        if (r.length < 30) return null;
        let recent = r.slice(-30);
        let t = recent.filter(x => x === 'TAI').length;
        let x = recent.filter(x => x === 'XIU').length;
        let p_t = t / 30, p_x = x / 30;
        let entropy = 0;
        if (p_t > 0) entropy -= p_t * Math.log2(p_t);
        if (p_x > 0) entropy -= p_x * Math.log2(p_x);
        if (entropy < 0.75) {
            if (p_t > p_x) return ['XIU', 0.82, `Entropy thấp → Đảo TÀI`];
            return ['TAI', 0.82, `Entropy thấp → Đảo XỈU`];
        }
        return null;
    }

    super_pattern_analysis(r) {
        if (r.length < 5) return null;
        let sp = r.slice(-4).join(',');
        if (this.super_pattern[sp]) {
            let data = this.super_pattern[sp];
            let total = Object.values(data).reduce((a, b) => a + b, 0);
            if (total >= 3) {
                for (let side of ['TAI', 'XIU']) {
                    let rate = (data[side] || 0) / total;
                    if (rate >= 0.70) return [side, Math.min(0.91, 0.68 + rate * 0.20), `SuperPattern`];
                }
            }
        }
        return null;
    }

    volatility_analysis(r) {
        if (this.volatility.length < 10) return null;
        let avg = this.volatility.reduce((a, b) => a + b, 0) / this.volatility.length;
        let recent = r.slice(-10);
        let ch = 0;
        for (let i = 1; i < recent.length; i++) if (recent[i] !== recent[i - 1]) ch++;
        if ((ch / 10) > avg * 1.5) {
            let last = r[r.length - 1];
            return [last === 'TAI' ? 'XIU' : 'TAI', 0.78, `Volatility cao`];
        }
        return null;
    }

    cycle_detection(r) {
        if (r.length < 30) return null;
        let seq = r.slice(-30);
        for (let cl of [3, 4, 5, 6, 7]) {
            if (seq.length >= cl * 3) {
                let m = 0;
                for (let i = seq.length - cl * 2; i < seq.length - cl; i++) {
                    if (seq[i] === seq[i + cl]) m++;
                }
                if (m >= cl * 2 - 1) {
                    let idx = seq.length - cl;
                    if (idx >= 0) return [seq[idx], 0.83, `Chu kỳ ${cl}`];
                }
            }
        }
        return null;
    }

    trend_analysis(r) {
        if (r.length < 25) return null;
        if (Math.abs(this.trend_strength) > 0.4) {
            if (this.trend_strength > 0) return ['TAI', 0.76, `Xu hướng TÀI mạnh`];
            return ['XIU', 0.76, `Xu hướng XỈU mạnh`];
        }
        return null;
    }

    predict(history) {
        if (history.length < 10) return [null, 0, "Cần thêm dữ liệu..."];
        this.push(history);
        this.learn();
        let r = this.results;
        let n = r.length;
        if (n < 5) return [null, 0, "..."];
        let last = r[n - 1];
        let last_sum = this.sums[this.sums.length - 1] || 10;

        let s = 1;
        for (let i = n - 2; i >= 0; i--) { if (r[i] === last) s++; else break; }

        let cands = [];

        for (let plen of [2, 3, 4, 5, 6]) {
            if (n >= plen) {
                let pat = r.slice(-plen).join(',');
                if (this.pattern_memory[pat] && this.pattern_total[pat] >= 3) {
                    let data = this.pattern_memory[pat];
                    let total = this.pattern_total[pat];
                    for (let side of ['TAI', 'XIU']) {
                        let count = data[side] || 0;
                        let rate = count / total;
                        if (rate >= this.adaptive_threshold && count >= 2) {
                            let conf = Math.min(0.94, 0.55 + rate * 0.42);
                            cands.push([side, conf * this.ngram_weights[plen], `Mẫu${plen}`]);
                        }
                    }
                }
            }
        }

        if (n >= 2) {
            let k2 = r[n - 2] + ',' + r[n - 1];
            if (this.transition_matrix[k2]) {
                let data = this.transition_matrix[k2];
                let total = Object.values(data).reduce((a, b) => a + b, 0);
                if (total >= 3) {
                    for (let side of ['TAI', 'XIU']) {
                        let rate = (data[side] || 0) / total;
                        if (rate >= 0.68) cands.push([side, 0.78 + rate * 0.15, `Markov2`]);
                    }
                }
            }
        }
        if (this.markov_chain[last]) {
            let data = this.markov_chain[last];
            let total = Object.values(data).reduce((a, b) => a + b, 0);
            if (total >= 3) {
                for (let side of ['TAI', 'XIU']) {
                    let rate = (data[side] || 0) / total;
                    if (rate >= 0.65) cands.push([side, 0.74 + rate * 0.15, `Markov1`]);
                }
            }
        }

        if (this.streak_memory[s]) {
            let data = this.streak_memory[s];
            let total = data.THEO + data.BE;
            if (total >= 3) {
                let bR = data.BE / total, tR = data.THEO / total;
                if (bR >= 0.62) {
                    let p = last === 'TAI' ? 'XIU' : 'TAI';
                    cands.push([p, Math.min(0.89, 0.55 + bR * 0.40), `Bệt${s} Bẻ`]);
                } else if (tR >= 0.62) {
                    cands.push([last, Math.min(0.86, 0.55 + tR * 0.40), `Bệt${s} Theo`]);
                }
            }
        }

        [this.super_pattern_analysis(r), this.quantum_analysis(r), this.fibonacci_analysis(r),
         this.entropy_analysis(r), this.volatility_analysis(r), this.cycle_detection(r),
         this.trend_analysis(r)].forEach(e => { if (e) cands.push(e); });

        if (cands.length > 0) {
            cands.sort((a, b) => b[1] - a[1]);
            let best = cands[0];
            return [best[0], Math.min(best[1], 0.97), best[2]];
        }

        let r50 = r.slice(-50);
        let t50 = r50.filter(x => x === 'TAI').length;
        let x50 = r50.filter(x => x === 'XIU').length;
        if (t50 > x50) return ["TAI", 0.55, `TÀI nhiều`];
        if (x50 > t50) return ["XIU", 0.55, `XỈU nhiều`];
        return [last_sum >= 11 ? "TAI" : "XIU", 0.52, `Theo tổng`];
    }

    update(pred, actual) {
        if (!pred) return;
        this.perf.push(pred === actual ? 1 : 0);
        if (this.perf.length >= 20) {
            let acc = this.perf.reduce((a, b) => a + b, 0) / this.perf.length;
            if (acc < 0.45) this.adaptive_threshold = Math.min(0.72, this.adaptive_threshold + 0.02);
            else if (acc > 0.60) this.adaptive_threshold = Math.max(0.50, this.adaptive_threshold - 0.01);
        }
    }
}

const userBrains = {};
const activeUsers = {};

function md5Hash(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

// Hàm lấy lịch sử cầu (Đã thêm log)
async function fetchHistoryFromAPI(limit = 60) {
    const urls = [
        "https://wtxmd52.tele68.com/v1/txmd5/sessions",
        "https://living-telecommunications-start-consoles.trycloudflare.com/api/txmd5"
    ];
    for (let url of urls) {
        try {
            const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0", "Origin": "https://lc79b.bet" }, timeout: 10000 });
            if (res.data && res.data.list) {
                let arr = res.data.list.sort((a, b) => a.id - b.id);
                let out = [];
                for (let it of arr) {
                    let p = it.point !== undefined ? it.point : (it.dices ? it.dices.reduce((a, b) => a + b, 0) : 0);
                    let r = it.resultTruyenThong;
                    if (r === 'TAI' || r === 'XIU') out.push({ session: it.id, dice: it.dices, total: p, result: r });
                }
                if (out.length > 0) return out.slice(-limit);
            }
        } catch (e) { 
            console.log(`[API ERROR] Không lấy được lịch sử từ ${url}: ${e.message}`);
            continue; 
        }
    }
    return [];
}

// Kết nối WSS đến LC79 (Đã thêm log chi tiết)
function connectToLC79WSS(sessionId) {
    const user = activeUsers[sessionId];
    if (!user) return;

    console.log(`[WSS] Đang kết nối tới LC79 cho user: ${user.username}...`);
    const socket = io("https://wtxmd52.tele68.com", {
        path: "/txmd5/",
        transports: ["websocket"],
        auth: { token: user.token },
        extraHeaders: { "User-Agent": "Mozilla/5.0", "Origin": "https://lc79b.bet" },
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 3000
    });

    user.socket = socket;

    socket.on('connect', async () => {
        console.log(`[WSS] ✅ Kết nối WSS thành công cho ${user.username}`);
        ioServer.emit('update_status', { sessionId, status: `✅ Đã kết nối WSS. Đang tải lịch sử...` });
        
        let arr = await fetchHistoryFromAPI(60);
        if (arr.length > 0) {
            user.raw_hist = arr;
            user.history = arr.map(x => x.result);
            user.points_history = arr.map(x => x.total);
            userBrains[sessionId] = new RealBrainUltra();
            userBrains[sessionId].push(arr);
            console.log(`[API] ✅ Tải thành công ${arr.length} phiên lịch sử.`);
            ioServer.emit('update_status', { sessionId, status: `✅ Đã tải ${arr.length} phiên lịch sử. Chờ phiên mới...` });
        } else {
            userBrains[sessionId] = new RealBrainUltra();
            console.log(`[API] ⚠️ Không lấy được lịch sử. Sẽ chờ dữ liệu mới.`);
            ioServer.emit('update_status', { sessionId, status: `⚠️ Không lấy được lịch sử cũ. Chờ phiên mới...` });
        }
    });

    socket.on('connect_error', (err) => {
        console.log(`[WSS ERROR] Lỗi kết nối WSS: ${err.message}`);
        ioServer.emit('update_status', { sessionId, status: `❌ Lỗi kết nối WSS: ${err.message}` });
    });

    socket.on('new-session', (data) => {
        console.log(`[WSS] 📌 Phiên mới: ${data.id}`);
        user.session_id = data.id;
        user.has_bet_this_session = false;
        let brain = userBrains[sessionId];
        let result = brain.predict(user.raw_hist || []);
        
        if (result[0]) {
            user.current_prediction = result[0];
            user.last_prediction_conf = Math.floor(result[1] * 100);
            let tien = user.base_bet * (user.martingale_enabled ? Math.pow(2, user.martingale_level) : 1);

            ioServer.emit('update_status', {
                sessionId,
                status: `📌 Phiên #${data.id} | Dự đoán: ${result[0]} (${user.last_prediction_conf}%) | ${result[2]} | Cược: ${tien.toLocaleString()}đ`
            });

            if (user.auto_bet_enabled && user.last_prediction_conf >= 55) {
                try {
                    socket.emit('bet', { type: user.current_prediction, amount: tien });
                    user.has_bet_this_session = true;
                    console.log(`[BET] 🚀 Đặt cược ${user.current_prediction} - ${tien}đ thành công.`);
                    ioServer.emit('update_status', { sessionId, status: `🚀 ĐÃ ĐẶT ${user.current_prediction} | ${tien.toLocaleString()}đ` });
                } catch (e) { console.log(`[BET ERROR] ${e.message}`); }
            }
        } else {
            user.current_prediction = Math.random() > 0.5 ? 'TAI' : 'XIU';
            ioServer.emit('update_status', { sessionId, status: `📌 Phiên #${data.id} | Chưa đủ DL - Random: ${user.current_prediction}` });
        }
    });

    socket.on('session-result', (data) => {
        let res = data.resultTruyenThong;
        if (res === 'TAI' || res === 'XIU') {
            let rec = { session: data.id, dice: data.dices, total: data.dices.reduce((a, b) => a + b, 0), result: res };
            if (!user.raw_hist) user.raw_hist = [];
            user.raw_hist.push(rec);
            if (!user.history) user.history = [];
            user.history.push(res);
            if (!user.points_history) user.points_history = [];
            user.points_history.push(rec.total);

            let brain = userBrains[sessionId];
            if (brain) brain.update(user.current_prediction, res);

            if (user.current_prediction === res) {
                user.win_streak++;
                user.lose_streak = 0;
                user.profit += user.bet_amount;
                user.martingale_level = 0;
                ioServer.emit('update_status', { sessionId, status: `🏆 WIN! KQ: ${res}`, profit: user.profit, loss: user.loss });
            } else {
                user.lose_streak++;
                user.win_streak = 0;
                user.loss += user.bet_amount;
                if (user.martingale_enabled && user.martingale_level < 6) user.martingale_level++;
                ioServer.emit('update_status', { sessionId, status: `💀 LOSE! KQ: ${res}`, profit: user.profit, loss: user.loss });
            }
        }
    });
}

// API Đăng nhập
app.post('/api/lc79/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Thiếu thông tin" });

    try {
        const hashedPass = md5Hash(password);
        const loginUrl = `https://apifo88daigia.tele68.com/api?c=3&un=${username}&pw=${hashedPass}&cp=R&cl=R&pf=web&at=`;
        const response = await axios.get(loginUrl);
        const data = response.data;

        if (!data.success) return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu!" });

        let sk = data.sessionKey;
        while (sk.length % 4 !== 0) sk += '=';
        const decoded = JSON.parse(Buffer.from(sk, 'base64').toString('utf-8'));
        const nickname = decoded.nickname;

        const tokenRes = await axios.post('https://wlb.tele68.com/v1/lobby/auth/login?cp=R&cl=R&pf=web&at=', {
            nickName: nickname, accessToken: data.accessToken
        });

        if (!tokenRes.data.token) return res.status(401).json({ error: "Không lấy được token LC79" });

        const token = tokenRes.data.token;
        const money = tokenRes.data.remoteLoginResp?.money || 0;
        const sessionId = crypto.randomBytes(16).toString('hex');

        activeUsers[sessionId] = {
            username: nickname, token, balance: money,
            profit: 0, loss: 0, auto_bet_enabled: false,
            base_bet: 10000, bet_amount: 10000,
            martingale_enabled: false, martingale_level: 0,
            win_streak: 0, lose_streak: 0,
            raw_hist: [], history: [], points_history: [],
            current_prediction: null, last_prediction_conf: 0
        };

        connectToLC79WSS(sessionId);

        res.json({ success: true, sessionId, username: nickname, balance: money });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error.message);
        res.status(500).json({ error: "Lỗi kết nối server LC79" });
    }
});

app.post('/api/lc79/toggle-auto', (req, res) => {
    const { sessionId } = req.body;
    const user = activeUsers[sessionId];
    if (!user) return res.status(401).json({ error: "Phiên không hợp lệ" });
    user.auto_bet_enabled = !user.auto_bet_enabled;
    res.json({ success: true, autoBet: user.auto_bet_enabled });
});

app.post('/api/lc79/set-bet-amount', (req, res) => {
    const { sessionId, amount } = req.body;
    const user = activeUsers[sessionId];
    if (!user) return res.status(401).json({ error: "Phiên không hợp lệ" });
    const betAmount = Number(amount);
    if (isNaN(betAmount) || betAmount < 1000) {
        return res.status(400).json({ error: "Số tiền cược tối thiểu là 1,000đ" });
    }
    user.base_bet = betAmount;
    user.bet_amount = betAmount;
    user.martingale_level = 0;
    res.json({ success: true, message: `Đã cập nhật mức cược: ${betAmount.toLocaleString()}đ` });
});

app.post('/api/lc79/status', (req, res) => {
    const { sessionId } = req.body;
    const user = activeUsers[sessionId];
    if (!user) return res.status(401).json({ error: "Phiên đã hết hạn" });

    let statusText = "Đang kết nối...";
    if (user.current_prediction) {
        statusText = `Phiên #${user.session_id} | Dự đoán: ${user.current_prediction} (${user.last_prediction_conf}%)`;
    }

    res.json({
        username: user.username,
        balance: user.balance,
        profit: user.profit,
        loss: user.loss,
        autoBet: user.auto_bet_enabled,
        status: statusText,
        betAmount: user.base_bet
    });
});

app.post('/api/lc79/logout', (req, res) => {
    const { sessionId } = req.body;
    const user = activeUsers[sessionId];
    if (user && user.socket) { try { user.socket.disconnect(); } catch (e) {} }
    delete activeUsers[sessionId];
    delete userBrains[sessionId];
    res.json({ success: true });
});

app.get('/', (req, res) => {
    res.send("🚀 Server VIP Tool đang chạy ổn định!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server VIP Tool chạy tại: http://localhost:${PORT}`);
});
