-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: gibson
-- ------------------------------------------------------
-- Server version	5.7.11-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `temp_user`
--

DROP TABLE IF EXISTS `temp_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temp_user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rank_id` int(10) unsigned NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(60) NOT NULL,
  `lname` varchar(128) NOT NULL,
  `fname` varchar(128) NOT NULL,
  `birth_date` date NOT NULL,
  `gender` varchar(64) NOT NULL,
  `address` varchar(128) NOT NULL,
  `unit_no` varchar(8) DEFAULT NULL,
  `city` varchar(64) NOT NULL,
  `province_id` int(13) unsigned NOT NULL,
  `postal_code` varchar(6) NOT NULL,
  `primary_phone` varchar(16) DEFAULT NULL,
  `secondary_phone` varchar(16) DEFAULT NULL,
  `email` varchar(128) NOT NULL,
  `send_notification` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `student` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `province_id` (`province_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temp_user`
--

LOCK TABLES `temp_user` WRITE;
/*!40000 ALTER TABLE `temp_user` DISABLE KEYS */;
INSERT INTO `temp_user` VALUES (1,1,'benjixd','$2a$12$x0PP5CjGfAkRADqXPGXaJ.Ryow7gPWT.xPdRExKHC/B/YsFnW/Sle','Zhao','Benjamin','1995-09-02','Male','310 Goldhawk Trail','','Toronto',1,'m1v4h2','','','benjamin.zhao1995@hotmail.com',0,1,'2016-03-03 06:09:20'),(2,1,'benji1','$2a$11$7emmqhMep8XzpG/ng2Azs.Glhk.9nOK9njwFSfaYhPF0svLCEMiuO','q','q','2016-03-05','Male','q','','q',1,'q1q1q1','q','q','benjamin.zhao1995@hotmail.com',0,0,'2016-03-05 17:57:33'),(3,1,'jorden','$2a$11$y674WHoTXh8U7DR5JzyEEeI9FRx.fEk2RVvOToZyURASVvQXdUCly','Zeng','jorden','2016-02-28','Male','196 Roxanne Crescent','','Scarborough',1,'M1V4G4','','','jordenzeng1995@gmail.com',0,1,'2016-03-05 18:01:06'),(4,1,'NicoForLife','$2a$12$i9lUlTvP1DiM2B34jhdkhuqWd2Ftj8uZ61NeXbnW8qky4NSvnuWBC','Xu','Kevin','1995-07-22','Male','96 Barnwell Drive','','Scarborough',1,'M1V1Y9','','','kevinxu_95@hotmail.com',1,1,'2016-03-05 18:28:13'),(5,1,'Rayden','$2a$12$/SK3l/d6VCSzEX6y4BWtO.r5K9wittshPcpTV95FFsu2BYgaQgryS','Smih','Kevan','2016-03-01','Male','345 xckjka','','esfdcbgnvhjuk',14,'Q1Q1Q1','','','kme@jcvkdm.com',0,0,'2016-03-05 18:37:25'),(6,1,'sldjekskcm','$2a$11$QxAZEaSZ64ndlLuoJaLzxOozp4.Mv4JJ2gSexBROCHYlJhu5TFili','ckljilslkx','icjsldck','2016-01-18','Other','123 kkkkkk','','fsdzgxchkjy',3,'Q1Q1Q1','','','kevinxu_95@hotmail.com',0,0,'2016-03-05 18:43:43'),(7,1,'qwerty','$2a$11$v2g0Wb2yyWPUTPbDZTEUoOskrwmfKxBmfKXMQX1ml5ZcUQwVY4Ztu','asvreag','hjsbnj','2016-03-01','Female','69 KappaRoss','','ccsfsc',3,'E3E3E3','','','kevinxu_95@hotmail.com',0,0,'2016-03-05 18:52:45'),(8,1,'kevin1','$2a$10$4qr1Zq7XmeAi1JFce.ag8.KkUQHzCIrRKygM.7fAHDtHIB5Sv5qwi','q','q','2016-03-05','Male','q','','toronto',1,'a1a1a1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-03-05 20:36:24'),(9,1,'allenaerosol','$2a$11$f8l12RrCOhjLac2uAKpGHejc.JLcBMxc4FKTCUuVjO42CXXb81UfW','Lee','Allen','1995-03-29','Male','157 roxanne cres','','Toronto',1,'m1v4g7','','','iceyallen569@Hotmail.com',1,1,'2016-03-05 20:45:10'),(10,1,'benjixd1','$2a$12$oCjOMl3F8xRN.FUju0HpMueD1NnRbmmf3F90ZvWH9/ICNfE7rKSc.','q','q','2016-03-05','Female','310 GOldhawk','','tt',2,'q1q1q1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-03-05 20:54:29'),(11,1,'benji12345','$2a$10$F8nDWjePBTcDU.i3ULxa1O.0ph6LSbCzsxvAJQHtd2lAn6Q3JpjLW','q','q','2016-03-05','Male','310 goldhawk','','toronto',1,'q1q1q1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-03-05 20:54:40'),(12,1,'bnjiiiii','$2a$12$t5otufIKMGKzdBFeg9qq2uj51jzL0qlOzHFEJuXF.xXZI.3tA2h8S','q','q','2016-03-05','Other','310 goldhawk','','toronto',1,'q1q1q1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-03-05 20:54:51'),(13,1,'zzzeeeetrrtt','$2a$12$dHNjrpw22uCHWke00X/Geu3SWE96Cx.2Wz7EeO8jlU9df6wbOavEO','q','q','2016-03-05','Male','310 goldhawk','','bbbb',1,'q1q1q1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-03-05 20:55:08'),(14,1,'ninetinin','$2a$12$7ceKgRYQQ2nSEPQZKeSoVOOcXokV9EAIafDYiKfT19WWL.aiUU2Uu','q','q','2016-03-05','Male','310 goldhawk','','tt',3,'q1q1q1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-03-05 20:56:09'),(15,1,'kxchukscjkj','$2a$10$Fde3VoQLOgRUpFDz/KHqm.1hFDYzGnVjXsJiCjW9EZgYcXz3NAbOC','xcshsu','cjhuksdk','2016-02-28','Male','812 jxhuskuk','','suuddud',1,'q1q1q1','','','fijldi@cjfdsu.com',0,0,'2016-03-05 21:01:07'),(16,1,'Rayden420','$2a$10$10w4vL6DDlvm50xIeeDza.z3zZjvxk.nJo8UE4hZ2O9vfVA92ICyC','Boop','Beep','1995-07-22','Male','123 kkkkkk','','fsdzgxchkjy',14,'Q1Q1Q1','','','kevinxu_95@hotmail.com',0,0,'2016-03-19 19:10:59'),(17,1,'nicememe','$2a$10$nm72WCn9XCcj4goGgONGye8UjeXsDUvZaYqEnjN0l6EbtLRRWT4I6','meme','nice','1999-01-01','Male','33 KOOOLAID LANE','','vjzklxjviek',14,'Q1Q1Q1','','','kevinxu_95@hotmail.com',0,0,'2016-03-19 19:15:46'),(18,1,'skdidiek','$2a$12$EnvjBhL.G7uPm7kbb2lVeuGrUid.kaPPL4PDchBbOZdRMqKUoqqmG','number','test','2016-03-17','Other','33 KOOOLAID LANE','','vjzklxjviek',14,'Q1Q1Q1','','','kevinxu_95@hotmail.com',0,0,'2016-03-19 19:20:09'),(19,1,'sdjifdsiljelfsa','$2a$11$0SQc8bJxzlGV7D049O7HSeqmyMCtrhUKxkDDeGmBSte73aNmWFwma','skldlkd','skldkd','2016-03-04','Other','444 kskks','','dfgzs',11,'w2w2w2','','','kevinxu_95@hotmail.com',0,0,'2016-03-19 19:28:04'),(20,1,'aksksle','$2a$10$D0S2/mga0TPr5qyD74tBTeo9wdLZAJSh1XzPC8XGkR8Ue9/.pORUC','qwe123','qwe123','2016-03-09','Male','555 Fcxvvszvx','','ksodfie',5,'w2w2w2','','','kevinxu_95@hotmail.com',0,0,'2016-03-19 19:31:07'),(21,1,'dkkdkdld','$2a$10$FasRw1/bgp1veXVqbvlF2Oz.mDPB6IT9sIjuNnmH3VwL.z4QSpXqa','Test','Kevan','2016-03-10','Male','69 KappaRoss','','dfadf',13,'Q1Q1Q1','','','kevinxu.444@gmail.com',0,0,'2016-03-19 19:44:02'),(22,1,'twer','$2a$12$cznNRepT3vnUjD2nkph1sep6Td1zfey41iZ1W.6bFOgMpPZqd3nCm','SDFEFSD','Bob','2016-03-11','Male','634 asdrg','','grfed',11,'w2w2w2','','','kevinxu.444@gmail.com',0,0,'2016-03-19 19:47:06'),(23,1,'erhdf','$2a$10$FTXpVIavcPhKzSexgf34Zet0x8zhHS0/EVItRCqnajpGfV80gx41.','meme','nice','2016-03-04','Male','33 KOOOLAID LANE','','fsdzgxchkjy',4,'y0l0l0','','','kevinxu.444@gmail.com',0,0,'2016-03-19 19:50:21'),(24,1,'qwe123','$2a$10$DBbDBihHo2eayRqrUn0RpeVJZR0NBYcbBpnZv8Vd6DhbUGZL4o1.C','SKEMNE','Bob','2016-03-05','Other','88 MPH Lane','','fsdzgxchkjy',11,'Q1Q1Q1','','','kevinxu.444@gmail.com',0,0,'2016-03-19 20:14:11'),(25,1,'lssoso','$2a$12$wygxhXVLTNuL8.xvXwh9kuZLmKyLgthDHLbWPRHA5RCR5AQixiHdK','Boop','Beep','2016-03-12','Male','333 yeeeee','','yiiiii',3,'t5t5t5','','','kevinxu.444@gmail.com',0,0,'2016-03-19 20:32:39'),(26,1,'dkfkfdi','$2a$10$KIPecMBO1pnIryv5mnrrqu21CYAlPkAKaD8H6dKZxqlRWsZotjOTi','SKEMNE','Bob','2016-03-12','Male','33 KOOOLAID LANE','','abfvdce',6,'Q1Q1Q1','','','kevinxu.444@gmail.com',0,0,'2016-03-19 20:39:23'),(27,1,'lkldlidi','$2a$10$tryU0A8TWgzj6oAa1G2yfeKuP1SCzsRidN4GFgzqEBAJZtQJU3T3W','Lee','Smith','2016-03-03','Female','730 hgrahty','','Kuuul',9,'I9I9I9','','','kevinxu.444@gmail.com',0,0,'2016-03-19 20:42:41'),(28,1,'slkdkle','$2a$10$TKxFsm.jQr/ws2z3ka1W8ue7RJvcmFF9sEGWzFDA.Tv2l06n73y9u','meme','nice','2016-03-05','Female','253 Lester Street','','Waterloo',1,'N2L3W6','','','kevinxu.444@gmail.com',0,0,'2016-03-19 20:49:02'),(29,1,'sksiek','$2a$12$Vr7/HG7vZzhQ2KWm0T2ue.x/EM58KBSewMEh1Twl4BenFtRDNNQJi','Boop','Beep','2016-03-12','Male','33 KOOOLAID LANE','','Scarborough',6,'U9U9U9','','','kevinxu.444@gmail.com',0,0,'2016-03-19 21:03:22'),(30,1,'asdfe','$2a$12$7wF5PLC/.Znwz679EhO.gu5ERixtYUZQ6V9GoYHRY1HXdns9fwaW.','nene','meme','2016-03-05','Male','33 KOOOLAID LANE','','vjzklxjviek',4,'Q1Q1Q1','','','kevinxu.444@gmail.com',0,0,'2016-03-19 21:29:15'),(31,1,'lckjslil','$2a$11$J4iJo8F7/ghrMC7pBCrnteWJUhQcjGcvMRlIWMZ0tpuv2OeYj09Qa','ukdjnsfg','zgxbr','2016-03-01','Female','69 KappaRoss','','Scarborough',7,'y0l0l0','','','kevinxu.444@gmail.com',0,0,'2016-03-19 21:42:30'),(32,1,'UEEEEE','$2a$10$KEarP9d9uWBlsY1kj7L8KuZmNU62Qmj2LKc9sR3Upaakc1INtSYIq','nwadv','vsd','2016-03-19','Other','96 Barnwell Drive','','Scarborough',6,'M1V1Y9','','','kevinxu.444@gmail.com',0,0,'2016-03-19 21:44:54'),(33,1,'qwet','$2a$12$K4rsmbgWy2uK1jQp5dA5NOAUk0wf7oO3NfI27k72AkupFhZp0iEyC','vvreasdf','bdfzvs','2016-03-06','Male','481 Centre Street','','Espanola',1,'P5E1J5','','','kevinxu.444@gmail.com',0,0,'2016-03-19 21:46:39'),(34,1,'dskkls','$2a$10$uY8uxZAvTc0.T4q31.p9..Ue6rnbv1A0kfBcB0MxZeYI0mesQlU.q','asfe','gsdfg','2016-03-16','Male','481 selslfk','','sdfasv',1,'P5E1J5','','','kevinxu.444@gmail.com',0,0,'2016-03-19 21:48:27'),(35,1,'hagfsd','$2a$11$IeNuLWS/9PW1ujXTzlNx5eG01uY7NJcx9tAcl3HS8K4FVCU.jQx2C','Lee','Allen','2016-03-07','Male','123 kkkkkk','','Waterloo',10,'t5t5t5','','','kevinxu.444@gmail.com',0,0,'2016-03-19 21:53:35'),(36,1,'dkdlsie','$2a$11$QfZ5Zt7pYZwH0ZkD1S31c.i7WwTsQDltZLDo2sLwBE2ROhBIB49pa','Boop','Beep','2016-03-14','Male','33 KOOOLAID LANE','','Waterloo',6,'w2w2w2','','','kevinxu.444@gmail.com',0,0,'2016-03-19 21:56:12'),(37,1,'qewreytry','$2a$11$SL8hR0HuJ8.YsYDqC93tz.77G.y0KRGRPsGaMG2aOwQUiVmvOwKqW','Smith','Bob','2016-03-07','Female','88 MPH Lane','','Waterloo',6,'w2w2w2','','','kevinxu.444@gmail.com',0,0,'2016-03-19 22:00:21'),(38,1,'world','$2a$10$BAWkvTEVVOo9ypysScHjRuZBIMxcnCy4EGucZluxtLbwophWYUlUa','Lee','Bob','2016-03-07','Male','730 hgrahty','','Mess',10,'Q1Q1Q1','','','kevinxu.444@gmail.com',0,0,'2016-03-19 22:04:56'),(40,1,'sdilfji','$2a$12$1P1vtctceC1FO8wI8Om43uBV4GoeBlDnMzeolvtFoSrTFs7yk1xmq','Smith','kdjfioszlcvj','2016-03-11','Female','123 kkkkkk','','Waterloo',12,'w2w2w2','','','kevinxu.444@gmail.com',0,0,'2016-03-19 22:12:39'),(42,1,'jhgsfzdg','$2a$11$oxQFMxWFArWyxj16LD8y9eKRG0MXKrSP2Pjruy3CRV8rB4PasHO6e','nice','meme','2016-03-10','Female','69 KappaRoss','','Waterloo',8,'r4r4r4','','','kevinxu.444@gmail.com',0,0,'2016-03-19 22:18:32'),(43,1,'Benjiiii','$2a$11$yROhESCJOCCI1AQ8nPg.HuMvuy8SG5CCJMbsyfGF01rGb3QNHh6i.','zhao','ben','2016-03-07','Male','253 Lester Street','','Waterloo',1,'N2L3W6','','','kevinxu.444@gmail.com',0,0,'2016-03-19 22:30:11'),(44,1,'fghjhfgdfad','$2a$11$DXsdy3xJmpasz1h87cBQ5.oa8fgIia/wxJzHbXqmiEIw01i1GNQxi','dsvbsdf','SDFESFD','2016-03-19','Male','135 xvbm','','Waterloo',6,'r4r4r4','','','kevinxu.444@gmail.com',0,0,'2016-03-19 22:41:00'),(45,1,'Mfdvbv','$2a$12$eUOx4Ooo01zplkjcQrrXSeCgM9MU4UNu2xYgr9ydQjbPId5vDyMzS','Smith','cscxzx','2016-03-07','Female','123 kkkkkk','','Waterloo',7,'r4r4r4','','','kevinxu.444@gmail.com',0,0,'2016-03-19 22:44:53'),(46,1,'ghfds','$2a$12$Gn5kuSEGgs.4S05ONoQYZekIPPJCTBCBxFHGt1/nt3I3g.eGIkOhO','adfzdvs','sfgsf','2016-03-10','Female','253 Lester Street','','Waterloo',1,'N2L3W6','15197296543','15197296543','kevinxu.444@gmail.com',0,0,'2016-03-19 23:07:46'),(47,1,'jghfjxnbnf','$2a$11$7iu0BAmFgpDKBgr8y4K66.5liYXQ4hsEgljCgOdI5AKDUxP4g629i','hadfgs','dsfdf','2016-03-13','Male','33 KOOOLAID LANE','','vjzklxjviek',4,'Q1Q1Q1','','','kevinxu.444@gmail.com',0,0,'2016-03-19 23:10:07'),(48,1,'gkljgjhdg','$2a$10$xkJczpsQzHHVIg519n4ZNeyJq74Or74vBjEaKWhGKFC5vgeEuyQJO','aefhsdg','fdgsfzfhg','2016-03-07','Female','533 dvsdcz','','Waterloo',5,'Q1Q1Q1','','','kevinxu.444@gmail.com',0,0,'2016-03-19 23:13:26'),(49,1,'jhdgjkgg','$2a$11$cBuKx9ODZtMUfgQkcYGR2e6TyzYrgCjUrniilfhnX/ysleFRs82oi','xcvvsc','fdbdbvd','2016-03-14','Female','533 dvsdcz','','Waterloo',6,'U9U9U9','','','kevinxu.444@gmail.com',0,0,'2016-03-19 23:26:22'),(50,1,'jcghdfn','$2a$10$6TfUoWyTOE79VA.g1lFs8u/jJeSbapoGuLA68yYBJer4oDc9mrFg2','gafsd','sadfwfw','2016-03-08','Other','88 MPH Lane','','jhnbgsvf',5,'K8K8K8','','','kevinxu.444@gmail.com',0,0,'2016-03-19 23:48:37'),(51,1,'TestUser1','$2a$11$gljfc9TDV23UTyq85X0boeFYVIUkc5AnyhDeRBMzdnI1u2vGXFfBW','Xu','Kevin','1995-07-22','Male','96 Barnwell Drive','','Scarborough',1,'M1V1Y9','5197296543','5197296543','kevinxu.444@gmail.com',0,0,'2016-03-25 15:55:27'),(52,1,'kuntekinte','$2a$12$jVcIS6mNRm.GSaKNXK/QFei6bpTQOwdhhwJsWJAmQQrsQDQRvizii','Cheng','Timmy','2016-03-23','Male','26 Statesman Square','','Toronto',1,'M1S4H6','6478948611','6478948611','timmaaaayycheng@gmail.com',0,0,'2016-03-26 01:27:32'),(53,1,'t32cheng','$2a$10$xDyiOup0jb7S5ggXgmj.NO2BIk/r5/qy5AN1XY0tdJpFZlKz4dosW','Cheng','Timmy','2016-04-01','Female','253 Lester Street Suite 403','','scarbs',1,'N2L3K8','','','timmaaaayycheng@gmail.com',0,0,'2016-04-03 20:54:56');
/*!40000 ALTER TABLE `temp_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-05 21:47:33
