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
-- Table structure for table `active_tokens`
--

DROP TABLE IF EXISTS `active_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `active_tokens` (
  `token_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `blacklisted` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `expiry_date` date DEFAULT NULL,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `desc` text,
  PRIMARY KEY (`token_id`),
  UNIQUE KEY `token_id_UNIQUE` (`token_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `active_tokens`
--

LOCK TABLES `active_tokens` WRITE;
/*!40000 ALTER TABLE `active_tokens` DISABLE KEYS */;
INSERT INTO `active_tokens` VALUES (1,'benjixd',1,'2016-03-04','2016-03-03 06:09:21','signup confirmation'),(2,'benji1',1,'2016-03-06','2016-03-05 17:57:34','signup confirmation'),(3,'jorden',1,'2016-03-06','2016-03-05 18:01:06','signup confirmation'),(4,'NicoForLife',0,'2016-03-06','2016-03-05 18:28:13','signup confirmation'),(5,'Rayden',0,'2016-03-06','2016-03-05 18:37:26','signup confirmation'),(6,'sldjekskcm',1,'2016-03-06','2016-03-05 18:43:43','signup confirmation'),(7,'qwerty',0,'2016-03-06','2016-03-05 18:52:45','signup confirmation'),(8,'kevin1',1,'2016-03-06','2016-03-05 20:36:24','signup confirmation'),(9,'allenaerosol',1,'2016-03-06','2016-03-05 20:45:11','signup confirmation'),(10,'benjixd1',0,'2016-03-06','2016-03-05 20:54:29','signup confirmation'),(11,'benji12345',0,'2016-03-06','2016-03-05 20:54:40','signup confirmation'),(12,'bnjiiiii',0,'2016-03-06','2016-03-05 20:54:52','signup confirmation'),(13,'zzzeeeetrrtt',0,'2016-03-06','2016-03-05 20:55:08','signup confirmation'),(14,'ninetinin',0,'2016-03-06','2016-03-05 20:56:09','signup confirmation'),(15,'kxchukscjkj',0,'2016-03-06','2016-03-05 21:01:09','signup confirmation');
/*!40000 ALTER TABLE `active_tokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-03-05 20:13:29
