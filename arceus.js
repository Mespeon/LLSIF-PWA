importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");


self.__precacheManifest = [].concat(self.__precacheManifest || []);

// CATCH ALL FROM GOOGLE APIS USING A REGULAR EXPRESSION
workbox.routing.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/, workbox.strategies.staleWhileRevalidate({
  cacheName: 'google-icons'
}));

// CATCH ALL REQUESTS FROM FIREBASE
workbox.routing.registerRoute(/.*(?:firebasestorage\.googleapis)\.com.*$/, workbox.strategies.staleWhileRevalidate({
  cacheName: 'firebase-thumbnails'
}));

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute([
  {
    "url": "_index.html",
    "revision": "c3709727b5523e7d910411728164b5b2"
  },
  {
    "url": "404.html",
    "revision": "0a27a4163254fc8fce870c8cc3a3f94f"
  },
  {
    "url": "arceus-base.js",
    "revision": "a5653d89e6ee984a23144aeba1115886"
  },
  {
    "url": "favicon.ico",
    "revision": "33a36d3c855cf5c896cafb21f671a2a2"
  },
  {
    "url": "index.html",
    "revision": "fce040f8b5d2db4f00769abad270692e"
  },
  {
    "url": "manifest.json",
    "revision": "b34f5861fbe18043145771a9c44c7ad6"
  },
  {
    "url": "members/ayase_eli.html",
    "revision": "f1b08aab0323172e8556b3e6eede3c96"
  },
  {
    "url": "members/hoshizora_rin.html",
    "revision": "5b67d719e7563831119791c5ab31ab7a"
  },
  {
    "url": "members/index.html",
    "revision": "fa78bf54650dbf102af83b783dae94ee"
  },
  {
    "url": "members/koizumi_hanayo.html",
    "revision": "7d2b917b887e255fe202d136a63a1e9e"
  },
  {
    "url": "members/kousaka_honoka.html",
    "revision": "cc845113bcd5f3b8ae18dfa93a183528"
  },
  {
    "url": "members/minami_kotori.html",
    "revision": "ef2b0ac508c28299f917c09bbb1fc0fa"
  },
  {
    "url": "members/nishikino_maki.html",
    "revision": "2c0396edddd407e2df1172405704b07b"
  },
  {
    "url": "members/sonoda_umi.html",
    "revision": "fc20d3d0da45b3ec44d897fbfb2d50f6"
  },
  {
    "url": "members/toujou_nozomi.html",
    "revision": "986a6449ccde916f208f578e2f5a7e03"
  },
  {
    "url": "members/yazawa_nico.html",
    "revision": "251da502419adf82171e222098e407c1"
  },
  {
    "url": "offline.html",
    "revision": "4f07984e588ab86b0cda4d9dca31f1cb"
  },
  {
    "url": "src/css/fonts.css",
    "revision": "4a28572f61033ba4b540a978e66bd6c3"
  },
  {
    "url": "src/css/muse.css",
    "revision": "01c0fb5124e65b5eff52e89b0ba90ec5"
  },
  {
    "url": "src/fonts/Montserrat-Black.ttf",
    "revision": "6d1796a9f798ced8961baf3c79f894b6"
  },
  {
    "url": "src/fonts/Montserrat-Bold.ttf",
    "revision": "88932dadc42e1bba93b21a76de60ef7a"
  },
  {
    "url": "src/fonts/Montserrat-Medium.ttf",
    "revision": "a98626e1aef6ceba5dfc1ee7112e235a"
  },
  {
    "url": "src/fonts/Montserrat-Regular.ttf",
    "revision": "9c46095118380d38f12e67c916b427f9"
  },
  {
    "url": "src/fonts/OpenSans-Bold.ttf",
    "revision": "f5331cb6372b6c0d8baf2dd7e200498c"
  },
  {
    "url": "src/fonts/OpenSans-Light.ttf",
    "revision": "9ff12f694e5951a6f51a9d63b05062e7"
  },
  {
    "url": "src/fonts/OpenSans-Regular.ttf",
    "revision": "d7d5d4588a9f50c99264bc12e4892a7c"
  },
  {
    "url": "src/fonts/OpenSans-SemiBold.ttf",
    "revision": "e1c83f9474e0cc1d84a13c6d1ddf3ca5"
  },
  {
    "url": "src/fonts/rbt_Black.ttf",
    "revision": "f3fa86edfc2b810bf7a3ea7cf010d292"
  },
  {
    "url": "src/fonts/rbt_Bold.ttf",
    "revision": "e31fcf1885e371e19f5786c2bdfeae1b"
  },
  {
    "url": "src/fonts/rbt_cndBold.ttf",
    "revision": "7ff4438405bfb9fe87b606ca356ba6a0"
  },
  {
    "url": "src/fonts/rbt_cndBoldItalic.ttf",
    "revision": "14029990066c7a7de585796da3051274"
  },
  {
    "url": "src/fonts/rbt_cndLight.ttf",
    "revision": "cf4449c1884598b292630aa9f4007c19"
  },
  {
    "url": "src/fonts/rbt_cndLightItalic.ttf",
    "revision": "52019ea2430e3a035f4c458f318bec4c"
  },
  {
    "url": "src/fonts/rbt_cndRegular.ttf",
    "revision": "e6fd95f0cb839566476ec9b6df34849c"
  },
  {
    "url": "src/fonts/rbt_Light.ttf",
    "revision": "46e48ce0628835f68a7369d0254e4283"
  },
  {
    "url": "src/fonts/rbt_Med.ttf",
    "revision": "894a2ede85a483bf9bedefd4db45cdb9"
  },
  {
    "url": "src/fonts/rbt_Regular.ttf",
    "revision": "3e1af3ef546b9e6ecef9f3ba197bf7d2"
  },
  {
    "url": "src/fonts/rbt_Thin.ttf",
    "revision": "94998475f6aea65f558494802416c1cf"
  },
  {
    "url": "src/fonts/rbt_ThinItalic.ttf",
    "revision": "8f066370a8530a3f3e971b8e274b7ddf"
  },
  {
    "url": "src/fonts/RobotoSlab-Bold.ttf",
    "revision": "d63ef23299458362f3edbf6cd8c2c510"
  },
  {
    "url": "src/fonts/RobotoSlab-Light.ttf",
    "revision": "79754934891c17dd798ca5e7eb5fa9a9"
  },
  {
    "url": "src/fonts/RobotoSlab-Regular.ttf",
    "revision": "1ec06eed11bbcb1ee510b8f3522adea8"
  },
  {
    "url": "src/fonts/RobotoSlab-Thin.ttf",
    "revision": "317a4210ef29a41c456503c8e5951448"
  },
  {
    "url": "src/js/app.js",
    "revision": "8c478538dbdfec59ed49a2978b6d9021"
  },
  {
    "url": "src/js/feed.js",
    "revision": "1083fc076e80f006fbb6022eb23d3b7e"
  },
  {
    "url": "src/js/fetch.js",
    "revision": "6b82fbb55ae19be4935964ae8c338e92"
  },
  {
    "url": "src/js/idb.js",
    "revision": "017ced36d82bea1e08b08393361e354d"
  },
  {
    "url": "src/js/jquery-3.1.1.min.js",
    "revision": "e071abda8fe61194711cfc2ab99fe104"
  },
  {
    "url": "src/js/jquery-ui.js",
    "revision": "358b27462a779ef5925ac81869985592"
  },
  {
    "url": "src/js/muse.js",
    "revision": "6e0e454b2ba6ad31d45fca6931ba9326"
  },
  {
    "url": "src/js/promise.js",
    "revision": "10c2238dcd105eb23f703ee53067417f"
  },
  {
    "url": "src/js/util.js",
    "revision": "bcfe82845984e808a70281ae95b1acb9"
  },
  {
    "url": "sw.js",
    "revision": "4c5e0f108da0b1ddd58617fcc560a1b3"
  },
  {
    "url": "src/images/llsif-aqours-group-2.jpg",
    "revision": "56dad56b81953d98166b7fc43aeb9607"
  },
  {
    "url": "src/images/llsif-aqours-group-3.jpg",
    "revision": "cf69789795a4a011376075028152e1a6"
  },
  {
    "url": "src/images/llsif-title-muse.jpg",
    "revision": "64e9475a4550269f615ff19ce7a10661"
  },
  {
    "url": "src/images/mfs-image-sfw.jpg",
    "revision": "a71d9e3d79b13c1194fdd3248a8565a1"
  },
  {
    "url": "src/images/mfs-image-small.jpg",
    "revision": "8aae1014f4eea2d46f1747c5778e7744"
  },
  {
    "url": "src/images/mfs-image.jpeg",
    "revision": "0781c9ea39a9cd484b13cae01dcdf538"
  },
  {
    "url": "src/images/muse-group.jpg",
    "revision": "4f6ec027937ad290921459c57b4f7f80"
  },
  {
    "url": "src/images/muse-momoland-cover-2.png",
    "revision": "df867051782fd715ae77e3d272c742f8"
  }
]);
