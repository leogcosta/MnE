--
-- Table structure for table 'users'
--

CREATE TABLE IF NOT EXISTS users (
  user_id int(10) NOT NULL AUTO_INCREMENT,
  user_full_name varchar(64) NOT NULL,
  user_username varchar(64) NOT NULL,
  user_password varchar(128) NOT NULL,
  user_type varchar(32) NOT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY user_username (user_username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table 'customers'
--

CREATE TABLE IF NOT EXISTS customers (
  customer_id int(10) NOT NULL AUTO_INCREMENT,
  customer_full_name varchar(64) NOT NULL,
  customer_phone_number varchar(13) NOT NULL,
  customer_email varchar(128) DEFAULT NULL,
  customer_user_user_id int(11) NOT NULL,
  PRIMARY KEY (customer_id),
  UNIQUE KEY customer_full_name (customer_full_name),
  INDEX customer_user_user_id_index (customer_user_user_id),
  FOREIGN KEY (customer_user_user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table 'items'
--

CREATE TABLE IF NOT EXISTS items (
  item_id int(11) NOT NULL AUTO_INCREMENT,
  item_item_id int(11) NOT NULL,
  item_name int(11) NOT NULL,
  item_unit_price decimal(10,3) NOT NULL,
  PRIMARY KEY (item_id),
  UNIQUE KEY item_item_id (item_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table 'accounts'
--

CREATE TABLE IF NOT EXISTS accounts (
  account_id int(11) NOT NULL AUTO_INCREMENT,
  account_name varchar(64) NOT NULL,
  account_user_user_id int(11) NOT NULL,
  PRIMARY KEY (account_id),
  UNIQUE KEY account_name (account_name),
  INDEX account_user_user_id_index (account_user_user_id),
  FOREIGN KEY (account_user_user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


-- --------------------------------------------------------

--
-- Table structure for table 'sales'
--

CREATE TABLE IF NOT EXISTS sales (
  sale_id int(11) NOT NULL AUTO_INCREMENT,
  sale_item_item_id int(11) NOT NULL,
  sale_item_quantity int(11) NOT NULL,
  sale_item_unit_price decimal(10,3) NOT NULL,
  sale_timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  sale_hold decimal(10,3) NOT NULL,
  sale_customer_customer_id int(11) NOT NULL,
  sale_user_user_id int(11) NOT NULL,
  PRIMARY KEY (sale_id),
  INDEX sale_user_user_id_index (sale_user_user_id),
  INDEX sale_customer_customer_id_index (sale_customer_customer_id),
  FOREIGN KEY (sale_user_user_id) REFERENCES users(user_id),
  FOREIGN KEY (sale_customer_customer_id) REFERENCES customers(customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Table structure for table 'transactions'
--

CREATE TABLE IF NOT EXISTS transactions (
  transaction_id int(11) NOT NULL AUTO_INCREMENT,
  transaction_type varchar(32) NOT NULL, -- deposit, transfer, outgoing, incoming
  transaction_amount decimal(10,3) NOT NULL,
  transaction_description text,
  transaction_timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  transaction_account_account_id int(11) NOT NULL,
  transaction_user_user_id int(11) NOT NULL,
  trasaction_sale_sale_id int(11),
  transaction_account_from_account_id int(11) DEFAULT NULL,
  INDEX transaction_user_user_id_index (transaction_user_user_id),
  INDEX transaction_account_account_id_index (transaction_account_account_id),
  INDEX transaction_account_from_account_id_index (transaction_account_from_account_id),
  PRIMARY KEY (transaction_id),
  FOREIGN KEY (transaction_user_user_id) REFERENCES users(user_id),
  FOREIGN KEY (transaction_account_account_id) REFERENCES accounts(account_id),
  FOREIGN KEY (transaction_account_from_account_id) REFERENCES accounts(account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
