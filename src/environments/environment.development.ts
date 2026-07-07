export const environment = {
    production: true,
    baseUrl: '',
    // skinId: "inrmaster",
    skinId: "dybet",

    api: {

        player: {
            register: "/api/player/register",
            login: "/api/player/login",
            logout: "/api/player/logout",
            fotgotPassword: "/api/player/forgotPassword",
            getProfile: "/api/player/getProfile",
            updateProfile: "/api/player/updateProfile",
            updatePassword: "/api/player/updatePassword",
            playerStats: "/api/player/getStats",
            playerLevels: "/api/cp/playerLevels",
            playerProviderList: "api/player/getPlayerProviderList",
            createAuthToken: "/rest/rummy/player/createAuthToken",
            validateToken: "/rest/rummy/player/validateToken",
            contactus: "api/player/contactUs",
        },

        cashier: {
            balance: "/api/cashier/balance",
            deposit: "/api/cashier/Mbuy",
            withDrawCashout: "/api/cashier/interKassaCashout",
            PaymentMethods: "/api/cashier/getPaymentMethods",
            depsoibuy:"/api/cashier/buy"

        },

        games: {
            pragmatictoken: "/rest/pp/ppToken",
            rubyPlayLaunch: "/rest/ruby_play/launch",
            aviatrixGameLaunch: "/rest/aviatrix/launchGame",
            cpgGameLaunch: "/rest/cpg/balance/launchGame",
            barbaraGameLaunch: "rest/barbara/launchGame",
            mancalaGameLaunch: "/rest/mancala/getToken",
            ezugiGameLaunch: "/rest/ezugi/session",
            habaneroGameLaunch: "rest/habanero/session",
            vibraGameLaunch: "/rest/vibra/launch",
            endorphinaGameLaunch: '/rest/endorphina/endorphinaUrl',
            playVivoHandlar: "/api/playVivo/handler/vivo",
            sporToken: "/rest/bti/btiToken",
            gameurl: "/rest/caballonegro",
            vivoGameLaunch: "api/Vivo/handler",
            popokGameLaunch: "rest/popokgaming/launchGame",
            instantPlay: "rest/api/gad/gameLaunchUrl/XYZ",
    sportoken:"/rest/powerPlay/launch",
    getpermissionData:"/api/player/getPlayerProviderList",
    getprovidersbeforelogin:"/api/agentAccount/getProviders",
    jdbLaunch: "rest/jdb/gameLaunch",
    GV: "rest/gv/request/launchGame",
    kagame: "rest/kagaming/launchGame",
    kingmidas: "/rest/kingmidas/launchGame",
    aviator: "rest/aviator/launchGame",
    peaches: "rest/onegamehub/launchGame",
    jilliprovider: "rest/jilli/launchGame",
    aviatrix: "rest/aviatrix/launchGame",
    wearelotto: "rest/wearelotto/launchGame",
    vivolivecasino: "/rest/vivo/balance_integration/vivoGaming",
    closeGameSession: "/api/player/closeSession",
    huidu: "/rest/huidu/launchGame",
    heblounch: "rest/habanero/session",
    indiecasino: "rest/indiCasino/api/handler",

        },

        history: {
            transaction: '/api/history/transactionCheck',
            remotegame: "/api/history/remoteGames"
        },
        
        sports: {},
    },
};
