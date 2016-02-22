-- MySQL dump 10.13  Distrib 5.7.9, for Win32 (AMD64)
--
-- Host: localhost    Database: gibson
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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rank_id` int(10) unsigned NOT NULL DEFAULT '1',
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
  `last_login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `province_id` (`province_id`),
  KEY `rank_id_idx` (`rank_id`),
  CONSTRAINT `province_id` FOREIGN KEY (`province_id`) REFERENCES `province` (`province_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `rank_id` FOREIGN KEY (`rank_id`) REFERENCES `rank` (`rank_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (16,1,'qq','$2a$12$KJIRxiUcR1YdLJj2DbCyVOyxPICewfg3h/QQeUwYxkgnJdSFv10du','qweqwe','Benjamin','2016-02-21','Female','q','','toronot',1,'a1a1a1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-02-22 02:26:22','2016-02-22 02:26:22'),(17,1,'321329096','$2a$12$95gNqWCKDKK5YQyaRwuE8Oyhj65M9RGQPEXZYQstzw264igu/5VzW','q','q','2016-02-21','Male','q','','tt',3,'a1a1a1','','','q@q.com',0,0,'2016-02-22 02:35:32','2016-02-22 02:35:32'),(19,1,'qqqq','$2a$11$70aG3uXae.f6FOnznrFTquC8tXl4.mV2P9qOo6Il41syMfSOTX/BW','q','q','2016-02-21','Female','q','','tttt',12,'a1a1a1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-02-22 02:39:35','2016-02-22 02:39:35'),(21,1,'231232142','$2a$11$fXpdhS.sk0VqvOPxpw3mEeZXesjpkZef56s27mzljmzPNi6KJQx4a','qweqwe','q','2016-02-17','Male','310 goldhawk','','toronto',3,'a1a1a1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-02-22 02:43:24','2016-02-22 02:43:24'),(23,1,'3213290966','$2a$11$GXd8ovYuXMAXF5.59ul1eemoUnKp23pJ53Yk4YlX5WuXYS3Wkh2W2','bbb','b','2016-02-21','Male','32113131','','toronot',3,'a1a1a1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-02-22 02:48:54','2016-02-22 02:48:54'),(25,1,'benjaminzhao','$2a$11$IGMv8wQICyTpd/mljeDWMeo6IUOJhp6OLF0TAMJiDo4ZdY5jBuPN6','q','q','2016-02-21','Male','32113131','','gg',2,'a1a1a1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-02-22 02:54:10','2016-02-22 02:54:10'),(27,1,'13213213213','$2a$10$vE.z.ZyPFhSYgIf00opi3.4vKSDbeEzMdPB.l86jrYdVuK94XqU0a','www','bbb','2016-02-09','Female','3210 goldhawk','','toronto',1,'A1A1A1','','','bimbo@poor.com',0,0,'2016-02-22 02:56:40','2016-02-22 02:56:40'),(28,1,'benjaminzhao1112233','$2a$10$gIAiD75ynDrkXAIRVSwGLu.TuyllXWjcZKuBTrvmBU2/GaupJ4xPG','beee','qQqQQ','2016-02-21','Male','310 GOldhawk','','toronto',13,'a1a1a1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-02-22 03:01:59','2016-02-22 03:01:59'),(29,1,'benjixd12123','$2a$10$PqSGJDaOp7NanHGzf5TtgOpC334ClevM20NApo77v1ux2OguAbeaW','zhzo','Benjamin','2016-02-02','Female','310 goldhawk','','tt',2,'A1A1A1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-02-22 03:05:05','2016-02-22 03:05:05'),(30,1,'321329096667876','$2a$12$lCRAAkMphxQlobnAqC51zO.ku/f6iwURDpJrlGJduH.1Hgn7NbgUS','a','aa','2016-02-21','Male','31','','toronto',3,'a1a1a1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-02-22 03:07:39','2016-02-22 03:07:39'),(31,1,'benjixd12213124215','$2a$10$aueFvHUI04LsPiFmCklt1.z0erypyonPVaCor5C0qeffL8C3S5jrO','123','benji','2016-02-16','Female','310 goldhawk','','tt',10,'a1b2a1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-02-22 03:09:06','2016-02-22 03:09:06'),(32,1,'321312456677','$2a$11$MtLzgvVJeJPyTtG4b6Ikyu8AOk7hwbM5zlrA9zzW14v9e0mECIWnC','as','ASas','2016-02-21','Female','310 goldhawk','','ttt',14,'a1a1a1','','','benjamin.zhao1995@hotmail.com',0,1,'2016-02-22 03:58:31','2016-02-22 03:58:31'),(33,1,'3213125785','$2a$11$8M1X3YWMwYj0xyehBIrjFu/rj/BvHVa5.PcY85X9Jpnx3tQyjZyzm','ad','a','2016-02-21','Female','b321312421','','ttt',2,'a1a1a1','','','benjamin.zhao1995@hotmail.com',0,1,'2016-02-22 04:06:21','2016-02-22 04:06:21');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-22 18:29:53
