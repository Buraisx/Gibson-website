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
-- Table structure for table `transaction_history`
--

DROP TABLE IF EXISTS `transaction_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transaction_history` (
  `transaction_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `paypal_id` varchar(64) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `state` varchar(64) NOT NULL,
  `intent` varchar(64) NOT NULL,
  `payment_method` varchar(64) NOT NULL,
  `payer_email` varchar(256) NOT NULL,
  `payer_first_name` varchar(128) NOT NULL,
  `payer_last_name` varchar(128) NOT NULL,
  `payer_id` varchar(128) NOT NULL,
  `total` decimal(16,2) NOT NULL,
  `currency` varchar(45) NOT NULL,
  `tax` decimal(16,2) DEFAULT '0.00',
  `shipping` decimal(16,2) DEFAULT '0.00',
  `description` text,
  PRIMARY KEY (`transaction_id`),
  UNIQUE KEY `transaction_id_UNIQUE` (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='Record for transaction history from paypal';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_history`
--

LOCK TABLES `transaction_history` WRITE;
/*!40000 ALTER TABLE `transaction_history` DISABLE KEYS */;
INSERT INTO `transaction_history` VALUES (1,'PAY-8HL62528UH056951RK4AZ5MY','2016-04-04 02:52:45',NULL,'approved','sale','paypal','kevinxu.444@gmail.com','Kevin','Xu','VE2833XH4KXEW',37.00,'CAD',0.00,0.00,'Signup fee for course(s): HW06JA-W16JA, SBA-W16'),(2,'PAY-3WP75029016208342K4AZ76I','2016-04-04 02:58:11',NULL,'approved','sale','paypal','kevinxu.444@gmail.com','Kevin','Xu','VE2833XH4KXEW',37.00,'CAD',0.00,0.00,'Signup fee for course(s): HW06JA-W16JA, SBA-W16'),(5,'PAY-71J009986F943163GK4A2MKY','2016-04-04 03:24:39',NULL,'approved','sale','paypal','kevinxu.444@gmail.com','Kevin','Xu','VE2833XH4KXEW',37.00,'CAD',0.00,0.00,'Signup fee for course(s): HW06JA-W16JA, SBA-W16'),(6,'PAY-38E783534S3390939K4A242Y','2016-04-04 04:00:21',NULL,'approved','sale','paypal','kevinxu.444@gmail.com','Kevin','Xu','VE2833XH4KXEW',147.00,'CAD',0.00,0.00,'Signup fee for course(s): MI01S01-W16, MI01I01-W16, MI01201-W16');
/*!40000 ALTER TABLE `transaction_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-04 22:46:04
