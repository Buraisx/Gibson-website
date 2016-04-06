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
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `active_tokens`
--

LOCK TABLES `active_tokens` WRITE;
/*!40000 ALTER TABLE `active_tokens` DISABLE KEYS */;
INSERT INTO `active_tokens` VALUES (1,'benjixd',1,'2016-03-04','2016-03-03 06:09:21','signup confirmation'),(2,'benji1',1,'2016-03-06','2016-03-05 17:57:34','signup confirmation'),(3,'jorden',1,'2016-03-06','2016-03-05 18:01:06','signup confirmation'),(4,'NicoForLife',0,'2016-03-06','2016-03-05 18:28:13','signup confirmation'),(5,'Rayden',0,'2016-03-06','2016-03-05 18:37:26','signup confirmation'),(6,'sldjekskcm',1,'2016-03-06','2016-03-05 18:43:43','signup confirmation'),(7,'qwerty',0,'2016-03-06','2016-03-05 18:52:45','signup confirmation'),(8,'kevin1',1,'2016-03-06','2016-03-05 20:36:24','signup confirmation'),(9,'allenaerosol',1,'2016-03-06','2016-03-05 20:45:11','signup confirmation'),(10,'benjixd1',0,'2016-03-06','2016-03-05 20:54:29','signup confirmation'),(11,'benji12345',0,'2016-03-06','2016-03-05 20:54:40','signup confirmation'),(12,'bnjiiiii',0,'2016-03-06','2016-03-05 20:54:52','signup confirmation'),(13,'zzzeeeetrrtt',0,'2016-03-06','2016-03-05 20:55:08','signup confirmation'),(14,'ninetinin',0,'2016-03-06','2016-03-05 20:56:09','signup confirmation'),(15,'kxchukscjkj',0,'2016-03-06','2016-03-05 21:01:09','signup confirmation'),(16,'Rayden420',0,'2016-03-20','2016-03-19 19:11:00','signup confirmation'),(17,'nicememe',0,'2016-03-20','2016-03-19 19:15:47','signup confirmation'),(18,'skdidiek',0,'2016-03-20','2016-03-19 19:20:09','signup confirmation'),(19,'sdjifdsiljelfsa',0,'2016-03-20','2016-03-19 19:28:04','signup confirmation'),(20,'aksksle',0,'2016-03-20','2016-03-19 19:31:07','signup confirmation'),(21,'dkkdkdld',0,'2016-03-20','2016-03-19 19:44:02','signup confirmation'),(22,'twer',0,'2016-03-20','2016-03-19 19:47:06','signup confirmation'),(23,'erhdf',0,'2016-03-20','2016-03-19 19:50:21','signup confirmation'),(24,'qwe123',0,'2016-03-20','2016-03-19 20:14:11','signup confirmation'),(25,'lssoso',0,'2016-03-20','2016-03-19 20:32:39','signup confirmation'),(26,'dkfkfdi',0,'2016-03-20','2016-03-19 20:39:23','signup confirmation'),(27,'lkldlidi',0,'2016-03-20','2016-03-19 20:42:41','signup confirmation'),(28,'slkdkle',0,'2016-03-20','2016-03-19 20:49:02','signup confirmation'),(29,'sksiek',0,'2016-03-20','2016-03-19 21:03:22','signup confirmation'),(30,'asdfe',0,'2016-03-20','2016-03-19 21:29:15','signup confirmation'),(31,'lckjslil',0,'2016-03-20','2016-03-19 21:42:30','signup confirmation'),(32,'UEEEEE',0,'2016-03-20','2016-03-19 21:44:54','signup confirmation'),(33,'qwet',0,'2016-03-20','2016-03-19 21:46:39','signup confirmation'),(34,'dskkls',0,'2016-03-20','2016-03-19 21:48:27','signup confirmation'),(35,'hagfsd',0,'2016-03-20','2016-03-19 21:53:35','signup confirmation'),(36,'dkdlsie',0,'2016-03-20','2016-03-19 21:56:12','signup confirmation'),(37,'qewreytry',0,'2016-03-20','2016-03-19 22:00:21','signup confirmation'),(38,'world',0,'2016-03-20','2016-03-19 22:04:56','signup confirmation'),(39,'sdilfji',0,'2016-03-20','2016-03-19 22:12:39','signup confirmation'),(40,'jhgsfzdg',1,'2016-03-20','2016-03-19 22:18:32','signup confirmation'),(41,'Benjiiii',0,'2016-03-20','2016-03-19 22:30:11','signup confirmation'),(42,'fghjhfgdfad',0,'2016-03-20','2016-03-19 22:41:00','signup confirmation'),(43,'Mfdvbv',0,'2016-03-20','2016-03-19 22:44:53','signup confirmation'),(44,'ghfds',0,'2016-03-20','2016-03-19 23:07:46','signup confirmation'),(45,'jghfjxnbnf',0,'2016-03-20','2016-03-19 23:10:07','signup confirmation'),(46,'gkljgjhdg',0,'2016-03-20','2016-03-19 23:13:26','signup confirmation'),(47,'jhdgjkgg',1,'2016-03-20','2016-03-19 23:26:23','signup confirmation'),(48,'jcghdfn',1,'2016-03-20','2016-03-19 23:48:38','signup confirmation'),(49,'allenaerosol',0,'2016-03-21','2016-03-20 05:47:10','Forgot Password'),(50,'allenaerosol',0,'2016-03-21','2016-03-20 05:49:52','Forgot Password'),(51,'allenaerosol',0,'2016-03-21','2016-03-20 05:51:31','Forgot Password'),(52,'allenaerosol',0,'2016-03-21','2016-03-20 06:04:35','Forgot Password'),(53,'allenaerosol',0,'2016-03-21','2016-03-20 06:06:11','Forgot Password'),(54,'allenaerosol',0,'2016-03-21','2016-03-20 06:18:28','Forgot Password'),(55,'allenaerosol',0,'2016-03-21','2016-03-20 06:26:30','Forgot Password'),(56,'allenaerosol',0,'2016-03-21','2016-03-20 06:30:36','Forgot Password'),(57,'allenaerosol',0,'2016-03-21','2016-03-20 06:33:36','Forgot Password'),(58,'allenaerosol',0,'2016-03-21','2016-03-20 06:41:43','Forgot Password'),(59,'allenaerosol',0,'2016-03-21','2016-03-20 06:55:30','Forgot Password'),(60,'allenaerosol',0,'2016-03-21','2016-03-20 06:56:20','Forgot Password'),(61,'allenaerosol',0,'2016-03-21','2016-03-20 07:01:04','Forgot Password'),(62,'allenaerosol',0,'2016-03-21','2016-03-20 07:02:16','Forgot Password'),(63,'TestUser1',1,'2016-03-26','2016-03-25 15:55:27','signup confirmation'),(64,'TestUser1',1,'2016-03-26','2016-03-25 16:22:30','password reset'),(65,'allenaerosol',1,'2016-03-26','2016-03-25 22:32:36','password reset'),(66,'kuntekinte',1,'2016-03-27','2016-03-26 01:27:32','signup confirmation'),(67,'allenaerosol',0,'2016-03-27','2016-03-26 03:14:56','password reset'),(68,'kuntekinte',1,'2016-03-27','2016-03-26 03:33:02','password reset'),(69,'allenaerosol',1,'2016-04-04','2016-04-03 16:35:55','password reset'),(70,'allenaerosol',1,'2016-04-04','2016-04-03 16:38:10','password reset'),(71,'allenaerosol',0,'2016-04-04','2016-04-03 16:38:31','password reset'),(72,'t32cheng',1,'2016-04-04','2016-04-03 20:54:56','signup confirmation'),(73,'jorden',1,'2016-04-04','2016-04-03 21:27:03','password reset');
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

-- Dump completed on 2016-04-05 21:57:06
