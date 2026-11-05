const API_BASE_URL = "https://nagoru-backend.onrender.com/";

// モード管理 (false: バーチャル周遊, true: リアルGPS周遊)
let isGpsMode = false;

// 1. エリア定義
const AREAS_DATA = {
    meio_north: {
        id: "meio_north", name: "名桜・為又エリア",
        desc: "名桜大学を中心とした北部・学園エリア。パイナップルパークや人気グルメが集まる！",
        x: 250, y: 180, unlocked: true, entrySpotId: "meio"
    },
    downtown: {
        id: "downtown", name: "市街地・21世紀の森エリア",
        desc: "名護の中心街！ビーチ・公園・港食堂・人気の居酒屋街が広がるメインエリア。",
        x: 480, y: 420, unlocked: true, entrySpotId: "park_21st"
    },
    yanbaru_east: {
        id: "yanbaru_east", name: "やんばる・東海岸エリア",
        desc: "ネオパークや名護城跡、広大な自然と絶景を満喫できる探検エリア！",
        x: 780, y: 320, unlocked: true, entrySpotId: "neopark"
    }
};

// 2. キャラクター ＆ 3択クイズ付きスポットデータ
const SPOTS_DATA = {
    // 【名桜・為又エリア】
    meio: {
        id: "meio", areaId: "meio_north", name: "名桜大学（拠点）", cat: "大学",
        desc: "冒険のスタート地点！名護の街を見渡す高台のキャンパス。",
        x: 235, y: 155, unlocked: true, visited: true, cleared: false,
        adjacentSpots: ["pineapple_park", "gabusoka_soba", "captain_kangaroo"],
        character: {
            name: "名桜サクラ（名桜生）", avatar: "🎓",
            intro: "「ようこそ名桜大学へ！名護の魅力を探検する準備はできた？まずはクイズに答えて冒険を出発しよう！」",
            quiz: {
                question: "【クイズ】名桜大学が開学したのは西暦何年でしょう？",
                options: ["1994年", "2005年", "2015年"],
                answerIndex: 0,
                hint: "💡 ヒント：1990年代半ば、平和の創造を掲げて開学したよ！"
            }
        }
    },
    pineapple_park: {
        id: "pineapple_park", areaId: "meio_north", name: "ナゴパイナップルパーク", cat: "遊び場",
        desc: "南国のパイナップルテーマパーク！果物の甘い香りが漂う。",
        x: 430, y: 220, unlocked: false, visited: false, cleared: false,
        adjacentSpots: ["meio", "nago_agri_park"],
        character: {
            name: "パインくん", avatar: "🍍",
            intro: "「パパパ パイナップル〜♪ パークにようこそ！」",
            quiz: {
                question: "【クイズ】パイナップルパーク内で乗ることができる自動運転の乗り物の名前は？",
                options: ["パイン号", "パイントレイン", "パイナップルカート"],
                answerIndex: 2,
                hint: "💡 ヒント：黄色くて可愛いカートだよ！"
            }
        }
    },
    nago_agri_park: {
        id: "nago_agri_park", areaId: "meio_north", name: "なごアグリパーク", cat: "遊び場",
        desc: "やんばるの農と食を楽しめる体感型アグリ施設！",
        x: 640, y: 240, unlocked: false, visited: false, cleared: false,
        adjacentSpots: ["pineapple_park"],
        character: {
            name: "アグリおじさん", avatar: "👨‍🌾",
            intro: "「採れたてのやんばる野菜と植物のおいしさを知っていってね！」",
            quiz: {
                question: "【クイズ】「アグリ」という言葉は何を意味しているでしょう？",
                options: ["アグリカルチャー（農業）", "アグレッシブ（積極的）", "アグリゲート（集まる）"],
                answerIndex: 0,
                hint: "💡 ヒント：やんばるの畑や農業に由来しているよ！"
            }
        }
    },
    gabusoka_soba: {
        id: "gabusoka_soba", areaId: "meio_north", name: "我部祖河食堂 名護", cat: "飲食店",
        desc: "元祖ソーキそばで有名なお店！ボリューム満点。",
        x: 360, y: 320, unlocked: false, visited: false, cleared: false,
        adjacentSpots: ["meio", "asahis_restaurant"],
        character: {
            name: "ソーキおやじ", avatar: "🍜",
            intro: "「うちは元祖ソーキそばの発祥なんだ！しっかり味わっていきなさい！」",
            quiz: {
                question: "【クイズ】「ソーキ」とは豚のどの部位のことでしょう？",
                options: ["三枚肉（バラ）", "アバラ肉（スペアリブ）", "テビチ（豚足）"],
                answerIndex: 1,
                hint: "💡 ヒント：骨のまわりのお肉が柔らかくて美味しい部位だよ！"
            }
        }
    },
    asahis_restaurant: {
        id: "asahis_restaurant", areaId: "meio_north", name: "朝日レストラン", cat: "飲食店",
        desc: "絶品ステーキが味わえる名護の老舗名店！",
        x: 250, y: 400, unlocked: false, visited: false, cleared: false,
        adjacentSpots: ["gabusoka_soba"],
        character: {
            name: "マスター・アサヒ", avatar: "🥩",
            intro: "「名護で長年愛されるステーキの旨味を味わってね！」",
            quiz: {
                question: "【クイズ】沖縄で飲み会（お酒）の後に食べる名物文化といえば何？",
                options: ["〆のラーメン", "〆のステーキ", "〆の沖縄そば"],
                answerIndex: 1,
                hint: "💡 ヒント：夜遅くに熱々の肉をガツンと食べるのが沖縄流！"
            }
        }
    },

    // 【市街地・21世紀の森エリア】
    park_21st: {
        id: "park_21st", areaId: "downtown", name: "21世紀の森公園", cat: "遊び場",
        desc: "美しいビーチとスポーツ施設が広がる市民の憩いの場。",
        x: 260, y: 410, unlocked: true, visited: true, cleared: false,
        adjacentSpots: ["miyazato_soba", "nago_port", "captain_kangaroo"],
        character: {
            name: "うみんちゅ翔", avatar: "🏖️",
            intro: "「21世紀の森ビーチの夕暮れは最高だよ！プロ野球キャンプもここで開かれるんだ。」",
            quiz: {
                question: "【クイズ】21世紀の森公園で春に春季キャンプを行うプロ野球チームは？",
                options: ["読売ジャイアンツ", "北海道日本ハムファイターズ", "阪神タイガース"],
                answerIndex: 1,
                hint: "💡 ヒント：名護スタジアム（タピックスタジアム名護）を拠点にするチームだよ！"
            }
        }
    },
    captain_kangaroo: {
        id: "captain_kangaroo", areaId: "downtown", name: "キャプテンカンガルー", cat: "飲食店",
        desc: "抱きつきたくなる絶品グルメハンバーガー！",
        x: 135, y: 315, unlocked: false, visited: false, cleared: false,
        adjacentSpots: ["park_21st"],
        character: {
            name: "キャプテン・ルー", avatar: "🍔",
            intro: "「抱きつきたくなるほどの特大ハンバーガーを召し上がれ！」",
            quiz: {
                question: "【クイズ】キャプテンカンガルーで一番人気の名物バーガーは？",
                options: ["ルースペシャル", "スパーキーバーガー", "メガチーズバーガー"],
                answerIndex: 1,
                hint: "💡 ヒント：カリカリのフライドオニオンがタワーのように入ったバーガーだよ！"
            }
        }
    },
    miyazato_soba: {
        id: "miyazato_soba", areaId: "downtown", name: "宮里そば", cat: "飲食店",
        desc: "地元民や名桜生に大人気の老舗沖縄そば店！",
        x: 390, y: 480, unlocked: false, visited: false, cleared: false,
        adjacentSpots: ["park_21st", "ganaha_yakiniku", "yukino"],
        character: {
            name: "宮里おばぁ", avatar: "👵",
            intro: "「いらっしゃい！昆布が乗った沖縄そばと、トーストも人気なんだよ。」",
            quiz: {
                question: "【クイズ】宮里そばで「沖縄そば」と並ぶ隠れた名物メニューは？",
                options: ["スパゲティ", "カレーライス", "トースト"],
                answerIndex: 2,
                hint: "💡 ヒント：そば屋さんなのにサクサクのパンにバターが塗られた一品！"
            }
        }
    },
    nago_port: {
        id: "nago_port", areaId: "downtown", name: "名護漁港食堂", cat: "飲食店",
        desc: "名護漁港直送の新鮮な魚料理・天ぷらが味わえる食堂！",
        x: 520, y: 620, unlocked: false, visited: false, cleared: false,
        adjacentSpots: ["park_21st", "higashi_shokudo"],
        character: {
            name: "海人ハルキ", avatar: "🐟",
            intro: "「名護の海で獲れた新鮮なサカナと、沖縄天ぷらは最高だぞ！」",
            quiz: {
                question: "【クイズ】沖縄の天ぷらの特徴として正しいものはどれ？",
                options: ["衣が分厚く味付き", "塩だけで食べる", "つゆに浸してふやかす"],
                answerIndex: 0,
                hint: "💡 ヒント：おやつ感覚でそのまま食べられるモチモチフリッター風！"
            }
        }
    },
    yukino: {
        id: "yukino", areaId: "downtown", name: "ゆきの", cat: "居酒屋",
        desc: "地元で長年親しまれる大衆居酒屋・定食のお店！",
        x: 280, y: 550, unlocked: false, visited: false, cleared: false,
        adjacentSpots: ["miyazato_soba", "ganaha_yakiniku"],
        character: {
            name: "居酒屋大将ゆきの", avatar: "🏮",
            intro: "「刺身、定食、寿司から沖縄料理まで何でも揃っているよ！」",
            quiz: {
                question: "【クイズ】名護市で生まれた有名なビールブランドは？",
                options: ["アサヒビール", "オリオンビール", "サッポロビール"],
                answerIndex: 1,
                hint: "💡 ヒント：名護市に大きな工場（ハッピーパーク）がある県民ビール！"
            }
        }
    },
    ganaha_yakiniku: {
        id: "ganaha_yakiniku", areaId: "downtown", name: "我那覇焼肉店", cat: "居酒屋",
        desc: "やんばる島豚や極上肉をたっぷり堪能できる人気店！",
        x: 540, y: 420, unlocked: false, visited: false, cleared: false,
        adjacentSpots: ["miyazato_soba", "yukino"],
        character: {
            name: "ガナハ店長", avatar: "🥩",
            intro: "「やんばるの豊かな自然で育った島豚あぐーの旨味を噛み締めてね！」",
            quiz: {
                question: "【クイズ】沖縄のブランド豚「あぐー」の毛の色は何色でしょう？",
                options: ["白髪（白豚）", "黒毛（黒豚）", "茶毛（茶豚）"],
                answerIndex: 1,
                hint: "💡 ヒント：黒い毛並みが特徴の琉球在来豚だよ！"
            }
        }
    },
    higashi_shokudo: {
        id: "higashi_shokudo", areaId: "downtown", name: "ひがし食堂", cat: "飲食店",
        desc: "ぜんざいやかき氷、定食が愛されるレトロ食堂！",
        x: 650, y: 530, unlocked: false, visited: false, cleared: false,
        adjacentSpots: ["nago_port"],
        character: {
            name: "ぜんざい看板娘", avatar: "🍧",
            intro: "「あつ〜い名護の夏には、ふわふわ氷のミルクぜんざいが一番よ！」",
            quiz: {
                question: "【クイズ】沖縄で「ぜんざい」といえばどんな食べ物？",
                options: ["温かい小豆粥", "冷たいかき氷乗せぜんざい", "冷やし汁粉"],
                answerIndex: 1,
                hint: "💡 ヒント：黒糖で煮た金時豆の上に、山盛りの氷が乗っているよ！"
            }
        }
    },

    // 【やんばる・東海岸エリア】
    neopark: {
        id: "neopark", areaId: "yanbaru_east", name: "ネオパークオキナワ", cat: "遊び場",
        desc: "広大な自然の中で鳥や動物たちとふれあえる動植物公園！",
        x: 750, y: 400, unlocked: true, visited: true, cleared: false,
        adjacentSpots: ["aeon_namco", "manmi"],
        character: {
            name: "フラミンゴ先輩", avatar: "🦩",
            intro: "「フライングケージの中で鳥たちが自由に飛んでいる姿を見ていってね！」",
            quiz: {
                question: "【クイズ】ネオパークオキナワの中を走っている昔の鉄道を模した乗り物は？",
                options: ["沖縄軽便鉄道", "やんばるモノレール", "ネオ蒸気機関車"],
                answerIndex: 0,
                hint: "💡 ヒント：かつて沖縄を走っていた実在の鉄道（ケイビン）がモデルだよ！"
            }
        }
    },
    aeon_namco: {
        id: "aeon_namco", areaId: "yanbaru_east", name: "モーリーファンタジー名護店", cat: "遊び場",
        desc: "イオン名護店内にある人気アミューズメントスポット！",
        x: 620, y: 480, unlocked: false, visited: false, cleared: false,
        adjacentSpots: ["neopark", "nago_central_park"],
        character: {
            name: "モーリーくん", avatar: "🎮",
            intro: "「ゲームで遊んだあとは、名護のショップでお買い物していこう！」",
            quiz: {
                question: "【クイズ】名護市市街地にあるイオン名護店の近くを走る国道は何号線？",
                options: ["国道58号線", "国道330号線", "国道329号線"],
                answerIndex: 0,
                hint: "💡 ヒント：沖縄本島を南北に縦断するメインストリートだよ！"
            }
        }
    },
    nago_central_park: {
        id: "nago_central_park", areaId: "yanbaru_east", name: "名護中央公園", cat: "遊び場",
        desc: "名護城跡（ナゴグスク）を囲む景色の良い桜の名所！",
        x: 650, y: 300, unlocked: false, visited: false, cleared: false,
        adjacentSpots: ["aeon_namco"],
        character: {
            name: "名護グスクの精", avatar: "🌸",
            intro: "「1月下旬頃になると、ピンク色のカンヒザクラが咲き誇るのよ！」",
            quiz: {
                question: "【クイズ】名護中央公園で咲く、日本一早咲きと言われる桜の種類は？",
                options: ["ソメイヨシノ", "カンヒザクラ（寒緋桜）", "八重桜"],
                answerIndex: 1,
                hint: "💡 ヒント：濃いピンク色が特徴的な、釣鐘状に咲く桜だよ！"
            }
        }
    },
    manmi: {
        id: "manmi", areaId: "yanbaru_east", name: "島豚七輪焼 満味", cat: "居酒屋",
        desc: "やんばる島豚の希少部位が七輪で味わえる名店！",
        x: 880, y: 350, unlocked: false, visited: false, cleared: false,
        adjacentSpots: ["neopark", "shokudo_shurei"],
        character: {
            name: "七輪の達人", avatar: "🔥",
            intro: "「島豚の鳴き声以外、頭から足先まで余すことなく美味しく召し上がれ！」",
            quiz: {
                question: "【クイズ】沖縄の豚肉文化を表す有名なことわざ『豚は〇〇以外全部食べる』の〇〇とは？",
                options: ["しっぽ", "鳴き声", "毛"],
                answerIndex: 1,
                hint: "💡 ヒント：音や声以外、命の恵みをすべて感謝していただくという意味だよ！"
            }
        }
    },
    shokudo_shurei: {
        id: "shokudo_shurei", areaId: "yanbaru_east", name: "食堂 守礼", cat: "飲食店",
        desc: "ボリューミーで味わい深いローカル食堂！",
        x: 880, y: 220, unlocked: false, visited: false, cleared: false,
        adjacentSpots: ["manmi"],
        character: {
            name: "シュレイおばぁ", avatar: "🍲",
            intro: "「お腹いっぱい食べて、やんばるの冒険を楽しんでいってね！」",
            quiz: {
                question: "【クイズ】沖縄の食堂で「ちゃんぷるー」と一緒に並ぶ定番炒め物「ちゃんぽん」の上に載っているのは？",
                options: ["中華麺", "野菜炒めの卵とじ", "ごはん"],
                answerIndex: 1,
                hint: "💡 ヒント：沖縄のちゃんぽんは「麺」ではなく「ご飯」の上に乗っているよ！"
            }
        }
    }
};

// 3. 状態管理
let currentMode = "world";
let currentAreaId = null;

let camera = { x: -100, y: -50, zoom: 0.85 };
let isDragging = false;
let startDrag = { x: 0, y: 0 };

let playerPos = { x: SPOTS_DATA.meio.x, y: SPOTS_DATA.meio.y };
let currentSpotId = "meio";
let selectedSpot = null;
let isMoving = false;
let movePath = [];
let currentPathIndex = 0;

const mapBgImage = new Image();
mapBgImage.src = 'map_background.png';
let isImageLoaded = false;
mapBgImage.onload = () => { isImageLoaded = true; };

const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');

// 4. マップ描画メインループ
function drawMap() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    if (isImageLoaded) {
        ctx.drawImage(mapBgImage, 0, 0, 1024, 750);
    } else {
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(0, 0, 1024, 750);
    }

    if (currentMode === "world") {
        drawWorldMap();
    } else {
        drawAreaMap();
    }

    ctx.restore();
    requestAnimationFrame(drawMap);
}

function drawWorldMap() {
    Object.values(AREAS_DATA).forEach(area => {
        ctx.beginPath();
        ctx.arc(area.x, area.y, 28, 0, Math.PI * 2);
        ctx.fillStyle = '#0284c7';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("🏰", area.x, area.y);

        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText(area.name, area.x + 1, area.y + 45);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(area.name, area.x, area.y + 44);
    });
}

function drawAreaMap() {
    drawRoads();

    Object.values(SPOTS_DATA).forEach(spot => {
        if (spot.areaId !== currentAreaId) return;

        ctx.beginPath();
        ctx.arc(spot.x, spot.y, 16, 0, Math.PI * 2);

        if (spot.cleared) {
            ctx.fillStyle = '#eab308'; // クイズクリア：ゴールド
        } else if (spot.visited) {
            ctx.fillStyle = '#22c55e'; // 訪問済み：緑
        } else if (spot.unlocked) {
            ctx.fillStyle = '#3b82f6'; // 解放済み：青
        } else {
            ctx.fillStyle = '#94a3b8'; // 未解放：グレー
        }
        ctx.fill();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = spot.id === selectedSpot?.id ? '#f59e0b' : '#ffffff';
        ctx.stroke();

        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let icon = "🔒";
        if (spot.cleared) icon = "⭐";
        else if (spot.visited) icon = "✅";
        else if (spot.unlocked) icon = "📍";
        ctx.fillText(icon, spot.x, spot.y);

        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText(spot.name, spot.x + 1, spot.y + 26);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(spot.name, spot.x, spot.y + 25);
    });

    if (SPOTS_DATA[currentSpotId]?.areaId === currentAreaId) {
        updatePlayerPosition();
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("🚶‍♂️", playerPos.x, playerPos.y - 12);
    }
}

function drawRoads() {
    ctx.lineWidth = 3.5;
    ctx.setLineDash([6, 6]);
    let drawnPairs = new Set();

    Object.values(SPOTS_DATA).forEach(spot => {
        if (spot.areaId !== currentAreaId) return;

        spot.adjacentSpots.forEach(adjId => {
            let targetSpot = SPOTS_DATA[adjId];
            if (!targetSpot || targetSpot.areaId !== currentAreaId) return;

            let pairKey = [spot.id, adjId].sort().join('-');
            if (!drawnPairs.has(pairKey)) {
                drawnPairs.add(pairKey);

                if (spot.unlocked && targetSpot.unlocked) {
                    ctx.strokeStyle = '#0284c7';
                } else {
                    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
                }

                ctx.beginPath();
                ctx.moveTo(spot.x, spot.y);
                ctx.lineTo(targetSpot.x, targetSpot.y);
                ctx.stroke();
            }
        });
    });
    ctx.setLineDash([]);
}

// 最短ルート計算
function findShortestPath(startId, targetId) {
    let queue = [[startId]];
    let visited = new Set([startId]);

    while (queue.length > 0) {
        let path = queue.shift();
        let node = path[path.length - 1];

        if (node === targetId) {
            return path.map(id => SPOTS_DATA[id]);
        }

        for (let neighborId of SPOTS_DATA[node].adjacentSpots) {
            let neighbor = SPOTS_DATA[neighborId];
            if (neighbor && neighbor.areaId === currentAreaId && neighbor.unlocked && !visited.has(neighborId)) {
                visited.add(neighborId);
                queue.push([...path, neighborId]);
            }
        }
    }
    return null;
}

function updatePlayerPosition() {
    if (!isMoving || movePath.length === 0) return;

    let targetNode = movePath[currentPathIndex];
    const dx = targetNode.x - playerPos.x;
    const dy = targetNode.y - playerPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const speed = 4;

    if (dist > speed) {
        playerPos.x += (dx / dist) * speed;
        playerPos.y += (dy / dist) * speed;
    } else {
        playerPos.x = targetNode.x;
        playerPos.y = targetNode.y;
        
        currentPathIndex++;
        if (currentPathIndex >= movePath.length) {
            isMoving = false;
            onPlayerArrived();
        }
    }
}

// 目的地到着時処理
function onPlayerArrived() {
    currentSpotId = selectedSpot.id;
    selectedSpot.visited = true;

    const log = document.getElementById('log-message');
    log.innerText = `🎉 ${selectedSpot.name}に到着しました！キャラクターに話しかけてクイズに挑戦しよう！`;

    // 到着した時だけ、クイズUIを表示する！
    showCharacterQuizUI(selectedSpot);
    renderNodes();
}

// ★ キャラクター＆クイズUIの表示処理（到着時・今いる場所でのみ表示）
function showCharacterQuizUI(spot) {
    const quizBox = document.getElementById('quiz-box');
    
    // 【修正点】プレイヤーが「今実際にいる場所」でなければ、クイズUIを表示しない！
    if (!spot || !spot.character || spot.id !== currentSpotId) {
        quizBox.style.display = "none";
        return;
    }

    quizBox.style.display = "block";

    const char = spot.character;
    document.getElementById('char-avatar').innerText = char.avatar;
    document.getElementById('char-name').innerText = char.name;
    document.getElementById('char-status').innerText = spot.cleared ? "⭐ クイズクリア！（仲良し度MAX）" : "🔒 未クリア（クイズに答えよう）";
    document.getElementById('char-message').innerText = spot.cleared ? `「${spot.name}のクイズ正解おめでとう！すっかり仲良しだね！」` : char.intro;

    const questionText = document.getElementById('quiz-question');
    const buttonsContainer = document.getElementById('quiz-buttons');

    questionText.innerText = char.quiz.question;
    buttonsContainer.innerHTML = "";

    // 3択ボタンを作成
    char.quiz.options.forEach((optText, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.innerText = `${index + 1}. ${optText}`;

        if (spot.cleared) {
            btn.disabled = true;
            btn.style.opacity = "0.6";
        } else {
            btn.addEventListener('click', () => handleQuizAnswer(spot, index));
        }

        buttonsContainer.appendChild(btn);
    });
}

// ★ クイズの回答判定 ＆ ルート開放処理
function handleQuizAnswer(spot, selectedIndex) {
    const char = spot.character;
    const msg = document.getElementById('char-message');
    const log = document.getElementById('log-message');

    if (selectedIndex === char.quiz.answerIndex) {
        // 【正解】
        spot.cleared = true;
        msg.innerText = `🎉「大正解！見事だね！すっかり君と仲良くなれたよ！新しいルートを開放するね！」`;
        log.innerText = `🌟 クイズクリア！${spot.name}周辺の新しい道（スポット）が開通しました！目的地を選んで移動しよう！`;

        // 周辺スポットの鍵を解除（unlocked = true）
        spot.adjacentSpots.forEach(adjId => {
            if (SPOTS_DATA[adjId]) {
                SPOTS_DATA[adjId].unlocked = true;
            }
        });

        showCharacterQuizUI(spot);
        renderNodes();
        checkAllClear(); // 全クリア判定
    } else {
        // 【不正解 ➔ ヒント表示＆そのまま再挑戦】
        msg.innerText = `❌「おしい！残念！…でも諦めないで！\n${char.quiz.hint}」`;
        log.innerText = "💡 キャラクターのヒントを参考に、もう一度選択肢を選んでみよう！";
    }
}

// 全クリア判定
function checkAllClear() {
    const allSpots = Object.values(SPOTS_DATA);
    const clearedSpots = allSpots.filter(s => s.cleared);

    if (clearedSpots.length === allSpots.length) {
        setTimeout(() => {
            alert("🏆 【全コンプリート！】\nおめでとうございます！名護市の全スポットのクイズをクリアしました！\nあなたは立派な「名護マスター」です！");
        }, 500);
    }
}

function enterArea(areaId) {
    currentMode = "area";
    currentAreaId = areaId;

    const areaInfo = AREAS_DATA[areaId];
    const entrySpot = SPOTS_DATA[areaInfo.entrySpotId];

    if (entrySpot) {
        currentSpotId = entrySpot.id;
        playerPos = { x: entrySpot.x, y: entrySpot.y };
        selectedSpot = entrySpot;
    }

    updateUIHeader();
    selectSpot(currentSpotId);
}

function returnToWorldMap() {
    currentMode = "world";
    currentAreaId = null;
    selectedSpot = null;
    isMoving = false;

    updateUIHeader();

    document.getElementById('spot-name').innerText = "エリアを選択してください";
    document.getElementById('spot-desc').innerText = "マップ上の🏰アイコンをタップして探検するエリアを選択してください。";
    document.getElementById('spot-actions').style.display = "none";
    document.getElementById('quiz-box').style.display = "none";
    document.getElementById('node-list').innerHTML = "";
    document.getElementById('log-message').innerText = "";
}

function selectSpot(spotId) {
    if (isMoving) return;

    selectedSpot = SPOTS_DATA[spotId];
    renderNodes();

    document.getElementById('spot-name').innerText = selectedSpot.name;
    document.getElementById('spot-desc').innerText = selectedSpot.desc;
    document.getElementById('spot-actions').style.display = "block";
    document.getElementById('log-message').innerText = "";

    // スポット選択時、現在地ならクイズ表示・未到着ならクイズ非表示
    showCharacterQuizUI(selectedSpot);
}

function updateUIHeader() {
    const mapSection = document.getElementById('map-section');
    let backBtn = document.getElementById('back-world-btn');

    if (currentMode === "area") {
        if (!backBtn) {
            backBtn = document.createElement('button');
            backBtn.id = 'back-world-btn';
            backBtn.className = 'primary-btn';
            backBtn.style.marginBottom = '10px';
            backBtn.style.background = '#0284c7';
            backBtn.innerText = "🗺️ 名護全域（ワールドマップ）へ戻る";
            backBtn.addEventListener('click', returnToWorldMap);
            mapSection.insertBefore(backBtn, mapSection.children[1]);
        }
        backBtn.style.display = "block";
    } else {
        if (backBtn) backBtn.style.display = "none";
    }
}

// 【修正点】移動処理の条件チェック強化
document.getElementById('visit-btn').addEventListener('click', () => {
    if (!selectedSpot || isMoving) return;

    // 1. すでにその場所にいる場合
    if (currentSpotId === selectedSpot.id) {
        document.getElementById('log-message').innerText = "すでにその場所にいます！クイズに答えて先の道を開放しよう！";
        return;
    }

    // 2. 「今いる場所」のクイズをクリアしていない場合、移動させない！
    const currentSpot = SPOTS_DATA[currentSpotId];
    if (currentSpot && !currentSpot.cleared) {
        document.getElementById('log-message').innerText = `⚠️ まずは今いる【${currentSpot.name}】のクイズに正解して道を開放してください！`;
        alert(`まずは現在地【${currentSpot.name}】のクイズに正解してください！`);
        return;
    }

    // 3. 最短ルートをチェックして移動開始
    const path = findShortestPath(currentSpotId, selectedSpot.id);

    if (path && path.length > 1) {
        movePath = path.slice(1);
        currentPathIndex = 0;
        isMoving = true;
        document.getElementById('log-message').innerText = `🚶‍♂️ ${selectedSpot.name}に向かって移動中...`;
    } else {
        document.getElementById('log-message').innerText = "その場所へ行く道がまだ繋がっていません！";
    }
});

// GPSボーナスボタン（リアル周遊モード時のみ機能）
document.getElementById('bonus-btn').addEventListener('click', () => {
    if (!selectedSpot) return;

    const log = document.getElementById('log-message');
    log.innerText = "📍 現在地のGPSを取得して確認中...";

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/checkin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        spot_id: selectedSpot.id,
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    })
                });

                const result = await response.json();
                if (result.success) {
                    log.innerText = `🎁 【現地特典GET！】${result.message}`;
                } else {
                    log.innerText = `❌ ${result.message}`;
                }
            } catch (err) {
                log.innerText = "エラー: サーバーと通信できませんでした。";
            }
        },
        (error) => {
            log.innerText = "GPS取得失敗: " + error.message;
        }
    );
});

function renderNodes() {
    const nodeList = document.getElementById('node-list');
    nodeList.innerHTML = "";

    if (currentMode !== "area") return;

    Object.values(SPOTS_DATA).forEach(spot => {
        if (spot.areaId !== currentAreaId) return;

        const btn = document.createElement('button');
        btn.className = `node-btn ${!spot.unlocked ? 'locked' : ''} ${selectedSpot?.id === spot.id ? 'active' : ''}`;
        
        let icon = "🔒 ";
        if (spot.cleared) icon = "⭐ ";
        else if (spot.visited) icon = "✅ ";
        else if (spot.unlocked) icon = "📍 ";

        btn.innerText = `${icon}${spot.name}`;

        if (spot.unlocked) {
            btn.addEventListener('click', () => selectSpot(spot.id));
        }

        nodeList.appendChild(btn);
    });
}

// 6. ドラッグ＆ズーム＆クリック判定
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startDrag = { x: e.clientX - camera.x, y: e.clientY - camera.y };
});

window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        camera.x = e.clientX - startDrag.x;
        camera.y = e.clientY - startDrag.y;
    }
});

window.addEventListener('mouseup', () => { isDragging = false; });

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 1.08;
    if (e.deltaY < 0) {
        camera.zoom = Math.min(camera.zoom * zoomFactor, 2.0);
    } else {
        camera.zoom = Math.max(camera.zoom / zoomFactor, 0.4);
    }
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - camera.x) / camera.zoom;
    const worldY = (mouseY - camera.y) / camera.zoom;

    if (currentMode === "world") {
        Object.values(AREAS_DATA).forEach(area => {
            const dist = Math.sqrt((worldX - area.x) ** 2 + (worldY - area.y) ** 2);
            if (dist <= 35) {
                enterArea(area.id);
            }
        });
    } else {
        Object.values(SPOTS_DATA).forEach(spot => {
            if (spot.areaId !== currentAreaId || !spot.unlocked) return;
            const dist = Math.sqrt((worldX - spot.x) ** 2 + (worldY - spot.y) ** 2);
            if (dist <= 20) {
                selectSpot(spot.id);
            }
        });
    }
});

// --- モード選択スタートイベント ---
function startGame(gpsMode) {
    isGpsMode = gpsMode;

    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const modeBadge = document.getElementById('mode-badge');
    const bonusBtn = document.getElementById('bonus-btn');
    const bonusHr = document.getElementById('bonus-hr');

    if (isGpsMode) {
        modeBadge.innerText = "📍 リアル周遊モード（GPS連動）";
        modeBadge.style.background = "#e0f2fe";
        modeBadge.style.color = "#0369a1";
        bonusBtn.style.display = "block";
        bonusHr.style.display = "block";
    } else {
        modeBadge.innerText = "🎮 バーチャル周遊モード（GPSなし）";
        modeBadge.style.background = "#f0fdf4";
        modeBadge.style.color = "#15803d";
        bonusBtn.style.display = "none";
        bonusHr.style.display = "none";
    }

    startScreen.classList.add('fade-out');

    setTimeout(() => {
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        returnToWorldMap();
        drawMap();
    }, 500);
}

document.getElementById('start-virtual-btn').addEventListener('click', () => startGame(false));
document.getElementById('start-real-btn').addEventListener('click', () => startGame(true));