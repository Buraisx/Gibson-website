var db_config = {
    host:'localhost',
    user:'root',
    password:'local123',
    database:'gibson',
    port:3306
};

// The universe will end before they brute force this!
var jwt = {
  secret: 'Pb+zW$rhBq2UhJ_BMTH@Lq_RU&GaYwLJKrmpAg*$8UsAzzbdJw@fdEzq?zpm?4A&H3JAE@NMwvuR?v!#Z*-n924=Xx6975=wt6GqKe8vR^w$eT6ykHB$z2yypV5dp?5jmJ%L7Dx3UT&E@j8befQQxHS39Fyf?Y%x!Q2*YsLE5ZBwr%?#nxrE2_=nnQsWLMLh!D5b4-VMdtj&hZuS=t?s^MZ6m+pq!ffn#8xcxbJNTdB3pUcLC5MWrf2Emvy5G$QH%PAt?qC_8@X7qfua6vyS3SNf7vEjPFZ?+KRjUfHQ28t#7#*^7gbntYErnENTpUh5jge^XS7_82NSDQR^nBKk@jKxNfB7EvJ-gpYAyC64FF?%G3wSE%gDNq8LnRLJCpNYL3j*R?eP#HRg8W@$vy3LQWxQK^eN?_erbp*6rfVw7_#g%BxeMWH79rxxER#mcyFX578Wze*D?sdc*+gA8jJ6=4SQ!mQ9tmFpR7a9JpE%b-saK*Au%PvD8L-2su2dwBZ%EwEayUJXhb4mM8S3k#Lskj%qgFBv%4w6$Qq!mDKZLEn84p$KLaa^a*N_Zw3R&WgH*&d45^PjGjfDL6*uP#jP+9LqtgDCCYbCM*Yk9#!7qLhtm=LW7czgju3kAZY?@6gRu9ZUH-tk*TS%9YkHBdhX6k@3S%+^KY%#L&9D9wML-gj@!Rr?h2vKE5ucKN%Ve^jR+Cy?fCk?Z?5RUg=k=F2WZLS3SU6CCH3W@2y8LYsRS462@%w8te6HKz$ZwPWYn8b98fa6#5b?JKxx%dT6mMS_Q7hL8!=pkQT#h-h$!kWU9+S5+kC$&Pg^s=HsfqtuDy%uPaDK!6fGdL8VnMN84!GN2L@Gw%3=CvCP6ZYCrpsLNm9amETqy3s8G&6sp8-gT-&9m4F_!hk7%qBUnR5SbUQ@Re?ZC#SWy#yp6*r_CnQ%+Ea_K$4bGF4U$mL%GRmq9pb-XExRUEwFCeB2^V7#QBAtpY^386p+eNg$V^Gf4g@s-u!6q8*8jv_^Uah*jzL@YH?q',
  admin_secret: 'f$ET6C4+uz#RVFN#ZT6%yd*AYqUA2fVH%#&_q?gPNXLe#4CKWx6h_%JZuUc6eB2aLFkATDsk_9rMFmugTFyf?^zEEVvp%JfDPp+sR_9rpT2qp9#-y3pWf?w=#EpmJxM2_mLeM9HUD+53F%hDeY948bTpt_HSgxT#%kDWHSvYz86r=Kchhk*XRNJRPQbU=wpVKXxySS=$kqDF$rA5#8z!^WQR2nqUqQCr!8N$t_!354BZaUZkN65UhuAjMZnhN7RV_P!AyHgahAEgcYXWWWKeU&q$G9pU%pLrc88BC^6sBLC8N6^-Z*j_VXC_QD?a9Eda9VCAe=%P5g2ZEj+n7M47mC-hS@DjYN^6-&7^xMSTD9xSSmPfn+5cXe8Bw7m9NZ2W99Z8&ebjAdstA8qxrX44y3kukdM_4kc*EZsfEN+#?qkJ9JyF?MmSt8w%zNZ=gWdcf#Zn%H?g!UhfUvYtEcZsBg!XQK?a@_P#*xjv4YXNhmj*L_hKhkw*mpdZBTmSD_KkQyqEwLUNyrBbD6&vSZ?Hs!vw^Bdq3A6@KGCPz9u=zr6fQ72@J-5CaDD-ydZP!L!x-QPJJaFXmGRaxeg?QTDdpnNd^KT+9xJ4asW!S*aWka?zNT45j@ZS7j9cCbgT#mfP_DPQ?K$D-HX987+q&+5Jg5VUcn*vUWw5Mduq9bW@MAm@PZq2uhem!mL587SgA4u!ZhYGKWJjK&a&kE&s2RxsJCCLryDWWwTnAV*gaPQskES4*Rd@Wgv@qLxE_JZTZU4kyR4C9svqbK!c3a_5L!v!6@q4g-VS@x4JEZxNwbMTk9Yp+TUy75rY9YSdyadM5nWAyZevR5YNKS8m6QLAamUjFBh2jkBn3j?g7V8pSV!gR$G$82UmRGxvar*Ghjz2AT2#JBJ5RRm-#ak^k%aV&n^#sCvVL22%ErpysQkye&_EEAyKmg4&y!8C%EEmRuSbK=&wjxV24GM#E4bEB8gc^xPV2tPEp%k_W4^vD@*Qj7@TtR!@XN2W^w$qQ=rXvp^^KFS6',
  issuer: 'https://www.105gibson.com'
};

module.exports.db_config = db_config;
module.exports.jwt = jwt;
