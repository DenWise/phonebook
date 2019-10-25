<?php
    namespace App\Services;

    use SimpleCrud\Database;
    use SimpleCrud\Scheme\Cache;
    use SimpleCrud\Scheme\Mysql;

    class Db
    {
        const MYSQL_DRIVER = 'mysql',
              CHARSET = 'charset=utf8',
              DB_CONF = 'config/db.php';

        protected $_config;
        public $connection;

        protected static $instance = null;

        protected function __clone(){}
        protected function __wakeup(){}

        /** @return static */
        public static function getInstance() {
            if (is_null(static::$instance)) {
                static::$instance = new static;
            }
            return static::$instance;
        }

        protected function __construct()
        {
            $this->_config = include self::DB_CONF;
            $this->connection = new Database($this->_getPdo());
        }

        protected function _getPdo()
        {
            $dsn = $this->_prepareDsn($this->_config);
            $username = $this->_config['username'];
            $password = $this->_config['password'];

            try {
                return new \PDO($dsn,$username,$password);
            } catch (\Exception $e) {
                die($e->getMessage());
            }

        }

        protected function _prepareDsn($config)
        {
            if (!$config['host'] || !$config['port'] || !$config['dbname']) {
                die("Database Error: Not enough data about database connection.");
            }

            return  self::MYSQL_DRIVER .
                    ":host=" . $config['host'] .
                    ";port=" . $config['port'] .
                    ";dbname=" . $config['dbname'] .
                    ";" . self::CHARSET;
        }
    }