-- phpMyAdmin SQL Dump
-- version 4.2.2
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Jul 22, 2014 at 05:32 AM
-- Server version: 5.5.36
-- PHP Version: 5.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `mne`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE IF NOT EXISTS `accounts` (
`account_id` int(11) NOT NULL,
  `account_name` varchar(64) NOT NULL,
  `account_user_user_id` int(11) NOT NULL,
  `account_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `account_name`, `account_user_user_id`, `account_timestamp`) VALUES
(3, 'Zemen', 1, '2014-07-13 08:35:00'),
(7, 'Barclay''s', 1, '2014-07-20 12:03:30'),
(8, 'Zenith', 1, '2014-07-20 07:35:07');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE IF NOT EXISTS `customers` (
`customer_id` int(10) NOT NULL,
  `customer_full_name` varchar(64) NOT NULL,
  `customer_phone_number` varchar(13) NOT NULL,
  `customer_email` varchar(128) DEFAULT NULL,
  `customer_user_user_id` int(11) NOT NULL,
  `customer_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=259 ;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `customer_full_name`, `customer_phone_number`, `customer_email`, `customer_user_user_id`, `customer_timestamp`) VALUES
(34, 'moe Szyslak', '0912442676', '', 1, '2014-07-04 06:00:00'),
(39, 'lanescape', '0913050427', '', 1, '2014-07-23 04:00:00'),
(44, 'fast click', '0912442676', '', 1, '0000-00-00 00:00:00'),
(65, 'Fresh Prince', '+251912442676', 'fresh@fresh.org', 1, '2014-07-15 14:00:28'),
(68, 'save', '0912442676', '', 1, '0000-00-00 00:00:00'),
(83, 'update', '0912442676', '', 1, '2014-07-20 14:56:05'),
(152, 'face off', '+251913050427', '', 1, '2014-07-21 08:11:00'),
(163, 'i new', '0912442676', '', 1, '0000-00-00 00:00:00'),
(165, 'i new x', '0912442676', '', 1, '2014-07-05 06:06:04'),
(180, 'MaMoe NEW notify', '0912442676', '', 1, '2014-07-05 07:26:02'),
(258, 'phased', '0912442676', '', 1, '2014-07-10 07:53:05');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE IF NOT EXISTS `items` (
`item_id` int(11) NOT NULL,
  `item_item_id` varchar(64) NOT NULL,
  `item_name` varchar(128) NOT NULL,
  `item_unit_price` decimal(10,3) NOT NULL,
  `item_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=17 ;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `item_item_id`, `item_name`, `item_unit_price`, `item_timestamp`) VALUES
(1, 'XD-346', 'Cloth update', '45.990', '0000-00-00 00:00:00'),
(3, 'XC-89', 'Roll Grade A', '99.780', '2014-07-19 02:30:26'),
(8, 'HDKDH-68', 'ios new', '68.800', '2014-07-15 13:51:25'),
(15, 'Ios', 'iOS 7.1.2', '78.990', '2014-07-12 08:57:44'),
(16, 'PTN', 'platinum', '50000.990', '2014-07-20 13:45:39');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE IF NOT EXISTS `sales` (
`sale_id` int(11) NOT NULL,
  `sale_item_item_id` int(11) NOT NULL,
  `sale_item_quantity` int(11) NOT NULL,
  `sale_item_unit_price` decimal(10,3) NOT NULL,
  `sale_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sale_owe` decimal(10,3) NOT NULL,
  `sale_hold` decimal(10,3) NOT NULL,
  `sale_auto_transfer` decimal(10,3) NOT NULL DEFAULT '0.000',
  `sale_customer_customer_id` int(11) NOT NULL,
  `sale_user_user_id` int(11) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=30 ;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`sale_id`, `sale_item_item_id`, `sale_item_quantity`, `sale_item_unit_price`, `sale_timestamp`, `sale_owe`, `sale_hold`, `sale_auto_transfer`, `sale_customer_customer_id`, `sale_user_user_id`) VALUES
(22, 16, 1, '50000.990', '2014-07-22 03:44:32', '50000.990', '2000.990', '95001.980', 152, 1),
(23, 16, 10, '50000.990', '2014-07-21 08:09:17', '500009.900', '354999.010', '374998.020', 152, 1),
(24, 8, 10, '68.800', '2014-07-21 08:08:50', '688.000', '0.000', '0.000', 152, 1),
(25, 8, 10, '68.800', '2014-07-22 03:41:17', '688.000', '0.000', '0.000', 152, 1),
(27, 3, 1, '99.780', '2014-07-22 03:32:20', '99.780', '0.000', '0.000', 44, 1),
(28, 3, 1, '99.780', '2014-07-22 03:35:04', '99.780', '0.000', '0.000', 44, 1),
(29, 3, 50, '99.780', '2014-07-22 03:46:33', '4989.000', '0.000', '0.000', 65, 1);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE IF NOT EXISTS `transactions` (
`transaction_id` int(11) NOT NULL,
  `transaction_type` varchar(32) NOT NULL,
  `transaction_amount` decimal(10,3) NOT NULL,
  `transaction_hold` decimal(10,3) DEFAULT NULL,
  `transaction_transfer` decimal(10,3) DEFAULT NULL,
  `transaction_description` text,
  `transaction_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `transaction_account_account_id` int(11) DEFAULT NULL,
  `trasaction_customer_customer_id` int(10) unsigned DEFAULT NULL,
  `transaction_user_user_id` int(11) NOT NULL,
  `trasaction_sale_sale_id` int(11) DEFAULT NULL,
  `transaction_account_from_account_id` int(11) DEFAULT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=17 ;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `transaction_type`, `transaction_amount`, `transaction_hold`, `transaction_transfer`, `transaction_description`, `transaction_timestamp`, `transaction_account_account_id`, `trasaction_customer_customer_id`, `transaction_user_user_id`, `trasaction_sale_sale_id`, `transaction_account_from_account_id`) VALUES
(11, 'CUSTOMER-DEPOSIT', '75000.000', '0.000', '0.000', '', '2014-07-21 07:22:15', 0, 152, 1, 0, 0),
(12, 'ACCOUNT-DEPOSIT', '6000.000', '0.000', '0.000', '', '2014-07-22 03:44:33', 8, 0, 1, 0, 0),
(13, 'ACCOUNT-DEPOSIT', '50000.000', '0.000', '0.000', '', '2014-07-22 03:42:18', 3, 0, 1, 0, 0),
(14, 'ACCOUNT-DEPOSIT', '15000.000', '0.000', '0.000', '', '2014-07-21 08:04:45', 7, 0, 1, 0, 0),
(15, 'CUSTOMER-DEPOSIT', '400000.000', '0.000', '0.000', '', '2014-07-21 08:09:17', 0, 152, 1, 0, 0),
(16, 'ACCOUNT-DEPOSIT', '50000.000', '0.000', '0.000', '', '2014-07-22 03:43:31', 8, 0, 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`user_id` int(10) NOT NULL,
  `user_full_name` varchar(64) NOT NULL,
  `user_username` varchar(64) NOT NULL,
  `user_password` varchar(128) NOT NULL,
  `user_type` varchar(64) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_full_name`, `user_username`, `user_password`, `user_type`) VALUES
(1, 'Moe Szyslak', 'moe', '46c011cb85acf685992a5cfa2c48a8fd898b431df02666f673a210ef0e99f541eef6a645244602ecc5ea018a222e9a04e54e25f9dcaf009a6d2be1ed99f32f11', 'CSO');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
 ADD PRIMARY KEY (`account_id`), ADD UNIQUE KEY `account_name` (`account_name`), ADD KEY `account_user_user_id_index` (`account_user_user_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
 ADD PRIMARY KEY (`customer_id`), ADD UNIQUE KEY `customer_full_name` (`customer_full_name`), ADD KEY `customer_user_user_id_index` (`customer_user_user_id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
 ADD PRIMARY KEY (`item_id`), ADD UNIQUE KEY `item_item_id` (`item_item_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
 ADD PRIMARY KEY (`sale_id`), ADD KEY `sale_user_user_id_index` (`sale_user_user_id`), ADD KEY `sale_customer_customer_id_index` (`sale_customer_customer_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
 ADD PRIMARY KEY (`transaction_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`user_id`), ADD UNIQUE KEY `user_username` (`user_username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
MODIFY `customer_id` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=259;
--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
MODIFY `sale_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `user_id` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`account_user_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`customer_user_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`sale_user_user_id`) REFERENCES `users` (`user_id`),
ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`sale_customer_customer_id`) REFERENCES `customers` (`customer_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
