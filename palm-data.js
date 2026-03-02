const PALM_DATA = {
  steps: [
    {
      id: 'overall',
      title: '手の全体印象',
      description: '手のひら全体を見て、全体的な印象を教えてください。',
      questions: [
        {
          id: 'lineCount',
          label: '線の多さ',
          helpText: '4大基本線（知能線・感情線・生命線・運命線）以外の細かい線がどれくらいありますか？',
          type: 'radio',
          image: 'images/lineCount.png',
          options: [
            { value: 'few', label: '① 少ない', description: '基本線以外ほとんどない' },
            { value: 'normal', label: '② 普通', description: '基本線の他にいくつか線がある' },
            { value: 'many', label: '③ 多い・複雑', description: '細かい線がたくさん走っている' }
          ]
        },
        {
          id: 'leftRight',
          label: '左右の手相の類似度',
          helpText: '左手と右手の主要な線（知能線・感情線）の形を比べてみてください。',
          type: 'radio',
          image: 'images/leftRight.png',
          options: [
            { value: 'similar', label: '① 似ている', description: '左右でほぼ同じ形をしている' },
            { value: 'different', label: '② 異なる', description: '左右で形がかなり違う' }
          ]
        }
      ]
    },
    {
      id: 'chinoLine',
      title: '知能線（頭脳線）',
      description: '人差し指と親指の付け根の間から出発し、手のひらを横切る線です。性格・才能・興味がわかります。',
      questions: [
        {
          id: 'chinoLength',
          label: '線の長さ',
          helpText: '薬指の延長線と比べてどうですか？',
          type: 'radio',
          image: 'images/chinoLength.png',
          options: [
            { value: 'short', label: '① 短い', description: '薬指のラインに届かない' },
            { value: 'normal', label: '② 普通', description: '薬指のラインくらいまで届く' },
            { value: 'long', label: '③ 長い', description: '薬指のラインを超えている' }
          ]
        },
        {
          id: 'chinoStart',
          label: '始点の位置',
          helpText: '人差し指と親指の付け根の間のどの位置から線が出ていますか？',
          type: 'radio',
          image: 'images/chinoStart.png',
          options: [
            { value: 'upper', label: '① 上（人差し指寄り）', description: '木星丘寄りから出ている' },
            { value: 'middle', label: '② 真ん中', description: '人差し指と親指のちょうど中間' },
            { value: 'lower', label: '③ 下（親指寄り）', description: '第1火星丘寄りから出ている' }
          ]
        },
        {
          id: 'chinoEnd',
          label: '終点の位置',
          helpText: '線の先端はどの方向に向かっていますか？',
          type: 'radio',
          image: 'images/chinoEnd.png',
          options: [
            { value: 'upper', label: '① 上向き（小指方向）', description: '水星丘の方向に向かっている' },
            { value: 'middle', label: '② 真ん中', description: '第2火星丘あたりで終わっている' },
            { value: 'lower', label: '③ 下向き（手首方向）', description: '月丘の方向に向かっている' }
          ]
        },
        {
          id: 'chinoSpecial',
          label: '特殊な形状',
          helpText: '知能線に特徴的な形はありますか？該当するものを全て選んでください。',
          type: 'checkbox',
          image: 'images/chinoSpecial.png',
          options: [
            { value: 'none', label: '① なし（通常の1本線）', description: '該当するものがない場合に選択' },
            { value: 'fork', label: '② 先端が二股に分かれている', description: '' },
            { value: 'double', label: '③ 知能線が2本ある（二重知能線）', description: '' },
            { value: 'masukake', label: '④ マスカケ線（感情線と一体化）', description: '手のひらを横一直線に横切る線' }
          ]
        }
      ]
    },
    {
      id: 'kanjoLine',
      title: '感情線',
      description: '小指の下あたりから出発し、人差し指方向に伸びる線です。愛情のタイプ・感受性がわかります。',
      questions: [
        {
          id: 'kanjoCurve',
          label: '線のカーブ',
          helpText: '感情線の形状はどちらに近いですか？',
          type: 'radio',
          image: 'images/kanjoCurve.png',
          options: [
            { value: 'straight', label: '① 直線的', description: 'まっすぐに近い形' },
            { value: 'curved', label: '② 曲線的', description: 'カーブを描いている' }
          ]
        },
        {
          id: 'kanjoHorizontal',
          label: '横の長さ',
          helpText: '線の先端はどこまで届いていますか？',
          type: 'radio',
          image: 'images/kanjoVertical.png',
          options: [
            { value: 'short', label: '① 短い', description: '中指の下あたりまで' },
            { value: 'normal', label: '② 標準', description: '中指と人差し指の間まで' },
            { value: 'long', label: '③ 長い', description: '人差し指の下やそれ以上' }
          ]
        },
        {
          id: 'kanjoVertical',
          label: '縦の長さ（指との距離）',
          helpText: '感情線と指の付け根との距離はどうですか？',
          type: 'radio',
          image: 'images/kanjoHorizontal.png',
          options: [
            { value: 'short', label: '① 短い（指と離れている）', description: '指の付け根から離れた位置' },
            { value: 'normal', label: '② 標準', description: '一般的な距離感' },
            { value: 'long', label: '③ 長い（指に近い）', description: '指の付け根に近い位置' }
          ]
        },
        {
          id: 'kanjoSpecial',
          label: '特殊な形状',
          helpText: '感情線に特徴的な形はありますか？該当するものを全て選んでください。',
          type: 'checkbox',
          image: 'images/kanjoSpecial.png',
          options: [
            { value: 'none', label: '① なし（通常）', description: '該当するものがない場合に選択' },
            { value: 'branchUp', label: '② 上向きの枝線がある', description: '' },
            { value: 'branchDown', label: '③ 下向きの枝線がある', description: '' },
            { value: 'double', label: '④ 感情線が2本ある（二重感情線）', description: '' }
          ]
        }
      ]
    },
    {
      id: 'unmeiLine',
      title: '運命線',
      description: '手首付近から中指に向かって縦に伸びる線です。人生の転機・仕事運・価値観がわかります。',
      questions: [
        {
          id: 'unmeiExist',
          label: '線の有無',
          helpText: '運命線ははっきり見えますか？',
          type: 'radio',
          image: 'images/unmeiExist.png',
          options: [
            { value: 'clear', label: '① はっきりある', description: '濃くしっかり見える' },
            { value: 'faint', label: '② ない・薄い', description: '見えない、またはかなり薄い' }
          ]
        },
      ]
    },
    {
      id: 'seimeiLine',
      title: '生命線',
      description: '人差し指と親指の間から出発し、親指の付け根を囲むように弧を描く線です。健康・寿命・生命力がわかります。',
      questions: [
        {
          id: 'seimeiThickness',
          label: '線の太さ・濃さ',
          helpText: '線の太さはどうですか？',
          type: 'radio',
          image: 'images/seimeiThickness.png',
          options: [
            { value: 'thick', label: '① 太い（濃い）', description: 'はっきりと太く見える' },
            { value: 'thin', label: '② 薄い', description: '細めで薄い' }
          ]
        },
        {
          id: 'seimieBulge',
          label: '張り出し（カーブの大きさ）',
          helpText: '中指の延長線と比べて、弧はどれくらい張り出していますか？',
          type: 'radio',
          image: 'images/seimieBulge.png',
          options: [
            { value: 'large', label: '① 大きい', description: '中指のラインを超えて張り出している' },
            { value: 'normal', label: '② 普通', description: '中指のラインちょうどくらい' },
            { value: 'small', label: '③ 小さい', description: '中指のラインに届かない' }
          ]
        },
        {
          id: 'seimeiEnd',
          label: '終点の位置',
          helpText: '線の先端はどちらに向かっていますか？',
          type: 'radio',
          image: 'images/seimeiEnd.png',
          options: [
            { value: 'venus', label: '① 内側（金星丘より）', description: '親指の付け根側に収まっている' },
            { value: 'earth', label: '② 真下（地丘方面）', description: '手のひら中央下部に向かっている' },
            { value: 'moon', label: '③ 外側（月丘より）', description: '小指側に流れている' }
          ]
        }
      ]
    }
  ],

  interpretations: {
    overall: {
      lineCount: {
        few: { text: 'メンタルが安定していて、おおらかな性格です。細かいことは気にしないタイプ。' },
        normal: { text: 'バランスの取れた性格の持ち主です。' },
        many: { text: '感受性がとても高く、繊細な方です。人の気持ちに敏感で、細かいことにも気づける反面、メンタルが不安定になりやすい一面もあります。' }
      },
      leftRight: {
        similar: { text: '感情が表情に出やすく、素直で裏表のない性格です。人のことを信じやすく、周りから信頼される存在です。' },
        different: { text: '状況に応じて臨機応変に対応できるタイプです。自分の短所を変える努力ができ、表面と内面を使い分ける力を持っています。' }
      }
    },

    chinoLine: {
      chinoLength: {
        short: {
          personality: '行動力に優れ、考える前にまず動けるタイプです。',
          talent: 'スピード感のある判断と実行力が強みです。'
        },
        normal: {
          personality: '考えることと行動のバランスが良いタイプです。',
          talent: '状況に応じて柔軟に対応できる力があります。'
        },
        long: {
          personality: '考えることが好きで、行動する前によく熟考するタイプです。',
          talent: '深い思考力と分析力が強みです。じっくり考えて本質を見抜く力があります。'
        }
      },
      chinoStart: {
        upper: {
          personality: '大胆で積極的、常識にとらわれない独立心の強いタイプです。',
          talent: 'リーダーシップやクリエイティブな才能があります。周りを気にせず突き進む力を持っています。',
          work: '起業家、クリエイター、リーダー職に向いています。'
        },
        middle: {
          personality: 'バランスの良い性格の持ち主です。',
          talent: '協調性と自主性を兼ね備えています。',
          work: '幅広い職種に適性があります。'
        },
        lower: {
          personality: '控えめで慎重、ルールや秩序を大切にするタイプです。',
          talent: '丁寧さと正確性に優れ、誰かのもとで指示を受けて動く方が安心して力を発揮できます。',
          work: 'サポート職、事務職、ルールに基づく業務に向いています。'
        }
      },
      chinoEnd: {
        upper: {
          personality: '現実主義で合理的に判断できるタイプです。',
          talent: 'コミュニケーション能力と商才に長けています。話術が巧みで、自分に有利に話を進められる力があります。',
          work: '起業家、営業職、外交官などが向いています。',
          money: 'お金に対して合理的で、稼ぐ力があります。'
        },
        middle: {
          personality: '冷静で合理的に判断でき、バランスの取れた思考の持ち主です。',
          talent: '忍耐力と自制心が強く、コツコツ積み上げる力があります。感情に左右されず冷静に物事を処理できます。',
          work: '士業、エンジニア、研究職などが向いています。',
          money: 'お金の管理が上手で、堅実に蓄えるタイプです。'
        },
        lower: {
          personality: 'ロマンチストで感性が豊かなタイプです。',
          talent: '芸術的才能と表現力に優れています。独特の世界観を持ち、周りから応援される運を持っています。',
          work: 'デザイナー、アーティスト、クリエイティブ職が向いています。',
          money: '感性に基づいた判断をするため、気分でお金を使うことも。'
        }
      },
      chinoSpecial: {
        none: { text: '' },
        fork: { text: '先端が二股に分かれた知能線は、複数の才能を持つ証です。何でも卒なくこなせる器用さがある一方、「器用貧乏」にならないよう、一つのことに集中する期間を意識的に設けると良いでしょう。' },
        double: { text: '二重知能線の持ち主です！脳が2つあるようなイメージで、ずば抜けて頭が良い方です。先見の明があり、周りからは理解されにくいこともありますが、それは才能の証です。' },
        masukake: { text: 'マスカケ線（天下取りの線）の持ち主です！最終的に大きな成果や成功を収める素質を持っています。波乱万丈な人生となりやすいですが、困難を乗り越えた先に望むものを手に入れることができます。普通の枠におさまらず、信念を持って我が道を突き進むことが大切です。' }
      }
    },

    kanjoLine: {
      kanjoCurve: {
        straight: {
          personality: '感情表現がストレートで、感情の振れ幅が小さくクールで冷静なタイプです。',
          love: '論理的に物事を判断でき、感情に左右されにくい安定感があります。',
          work: '仕事を仕事と割り切れ、苦手なことも淡々とこなせます。感情に左右されず一定のパフォーマンスを保てます。',
          advice: '小さな感情表現を言葉にして伝える・リアクションを少し大きくすることを心がけると、人間関係がさらに良くなります。'
        },
        curved: {
          personality: '感情表現が優しく、喜怒哀楽がはっきりしているタイプです。共感力が高く、人の気持ちを察する力があります。',
          love: '感情が豊かで、場の雰囲気を明るくするムードメーカー気質を持っています。',
          work: '人の気持ちを理解する力が強い一方、嫌いなことは頑張りにくい面もあります。感情を仕事に持ち込みやすい傾向があります。',
          advice: '感情のアップダウンが出やすいので、自分の感情を整える小さなルーティンを持つと良いでしょう。'
        }
      },
      kanjoHorizontal: {
        short: {
          text: '感情面では冷静で淡白、サバサバした性格です。落ち着いた対応ができる人です。',
          love: '恋愛では冷静な判断ができますが、やや淡白に見られることも。'
        },
        normal: {
          text: '愛情のバランスが良いタイプです。',
          love: '愛情深さと冷静さのバランスが取れています。'
        },
        long: {
          text: '愛情深く、相手に尽くすタイプです。好きな人に対しては心を開いて愛を注ぎます。',
          love: '独占欲や嫉妬心が強くなることもありますが、それは愛情の深さの裏返しです。'
        }
      },
      kanjoVertical: {
        short: {
          text: '恋愛に対しては受け身で消極的、シャイで控えめなタイプです。',
          love: '自分からアプローチするのが苦手ですが、慎重な分、信頼できる相手を選べます。'
        },
        normal: {
          text: '積極性と慎重さのバランスが取れています。',
          love: '適度な距離感で人と接することができます。'
        },
        long: {
          text: '積極的で感情表現が豊かなタイプです。自らアクションを起こせる行動力があります。',
          love: '恋愛でも自分から積極的に動けるタイプです。'
        }
      },
      kanjoSpecial: {
        none: { text: '' },
        branchUp: { text: '上向きの枝線があり、ポジティブで積極的な恋愛観を持っています。' },
        branchDown: { text: '下向きの枝線があり、繊細で傷つきやすい面を持っています。過去の経験から慎重になっている可能性がありますが、それは自分を守る力でもあります。' },
        double: { text: '二重感情線の持ち主です！愛情が非常に深く、仕事と家庭を両立できるエネルギーを持っています。人の倍以上の愛情を注げる稀有な存在です。' }
      }
    },

    unmeiLine: {
      unmeiExist: {
        clear: {
          text: '運命線がはっきりある方は、リーダータイプです。目標やビジョンを明確に持ち、自分の力で道を切り開く力があります。目標実現のためなら嫌なことでも努力でき、周りを巻き込む力も持っています。',
          work: '自己実現ができるタイプで、仕事運も強いです。'
        },
        faint: {
          text: '運命線が薄い・ないタイプはサポートタイプです。これは「運がない」という意味ではなく、周りのサポート役が向いているということ。好きなことなら頑張れるタイプで、趣味の延長のような感覚で仕事をすると力を発揮できます。',
          work: '人をサポートする仕事や、自分の好きなことを仕事にすると輝けます。'
        }
      },
    },

    seimeiLine: {
      seimeiThickness: {
        thick: { text: '生命力が強く、体力だけでなく気力もある方です。性格も明るく積極的。ただし、無理をしがちな面もあるので、たまにはしっかり休むことも大切です。' },
        thin: { text: '繊細で人を思いやれる優しさを持つ方です。体力・気力は控えめな傾向にありますが、無理をせず自分のペースを大切にすることで、充実した毎日を過ごせます。' }
      },
      seimieBulge: {
        large: { text: '生命力が非常に強く、根性と自信を兼ね備えています。困難な状況でも乗り越える力があります。' },
        normal: { text: '生命力は程よくバランスが取れています。無理のしすぎも控えめすぎもなく、持続力を持って行動できるタイプです。' },
        small: { text: '体力は控えめですが、その分無理をしない賢い生き方ができます。自分のペースを大切にしましょう。' }
      },
      seimeiEnd: {
        venus: { text: '身内や地元とのつながりが深く、家庭的な方です。安心できる環境の中で力を発揮するタイプです。' },
        earth: { text: '真下に向かう生命線は、地に足のついた堅実な生き方を好むタイプです。地丘方面への流れは、安定と継続を重視する傾向を示します。' },
        moon: { text: '地元を離れて活躍できるタイプです。海外との縁が強い方もいます。感性や芸術性を活かすと良い方向に進みます。アクティブで、家でじっとしているより外に出た方が運が開けます。' }
      }
    }
  },

  resultCategories: [
    { id: 'personality', title: '性格・才能タイプ', icon: '✨' },
    { id: 'work', title: '仕事運', icon: '💼' },
    { id: 'love', title: '恋愛', icon: '💕' },
    { id: 'health', title: '健康・生命力', icon: '🌿' },
    { id: 'advice', title: '総合アドバイス', icon: '💬' }
  ]
};
