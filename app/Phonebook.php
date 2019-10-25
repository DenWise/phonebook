<?php


    namespace App;

    use \App\Models\Contact;

    class Phonebook
    {
        const VIEW_FILES_DIR = '/views/',
              LAYOUT_FILE_NAME = '/app.html',
              ALREADY_EXISTS_CODE = '23000';

        private $_view;
        private $_model;

        public function __construct()
        {
            $this->_view = $this->_getViewPath(strtolower((new \ReflectionClass($this))->getShortName()));
            $this->_model = new Contact();
        }

        public function view()
        {
            if (!file_exists($this->_view)) {
                die("App view file is not created. It must be 'app.html' file in app/views/{app_name} directory.");
            }

            echo file_get_contents($this->_view);
        }

        public function numbersList()
        {
            $this->_sendJsonResponse($this->_model->getAll());
        }

        public function create($params)
        {
            $response = array();

            try {
                $id = $this->_model->create($params);
                $response['message'] = 'New record has been created successfully!';
                $response['id'] = $id;
                $this->_sendJsonResponse($response,201);
            } catch (\PDOException $e) {
                if ($e->getCode() == self::ALREADY_EXISTS_CODE) {
                    $this->_sendJsonResponse(array("message" => "Contact with this number has already exists."), 500);
                }
                $this->_sendJsonResponse(array("message" => "Error while creating the contact: {$e->getMessage()}"), 500);
            }
        }

        public function get($id)
        {
            if (is_null($id) || $id == '') {
                $this->_sendJsonResponse(array('message' => 'Have no IDea what does it means.'), 400);
            }

            try {
                $contact = $this->_model->getOne($id);
                $this->_sendJsonResponse($contact,200);
            } catch (\Exception $e) {
                $this->_sendJsonResponse(array('message' => "Fetching the contact failed with message: {$e->getMessage()}"),500);
            }
        }

        public function remove($id)
        {
            if (is_null($id) || $id == '') {
                $this->_sendJsonResponse(array('message' => 'Have no IDea what does it means.'), 400);
            }

            try {
                $this->_model->delete($id);
                $this->_sendJsonResponse(array('message' => 'Contact successfully deleted.'),200);
            } catch (\Exception $e) {
                $this->_sendJsonResponse(array('message' => "Deleting the contact failed with message: {$e->getMessage()}"),500);
            }
        }

        public function edit($id, $params)
        {
            if (is_null($id) || $id == '') {
                $this->_sendJsonResponse(array('message' => 'Have no IDea what does it means.'), 400);
            }

            try {
                $this->_model->edit($id, $params);
                $this->_sendJsonResponse(array('message' => 'Contact data updated successfully'),200);
            } catch (\Exception $e) {
                $this->_sendJsonResponse(array('message' => "Fetching the contact failed with message: {$e->getMessage()}"),500);
            }
        }

        protected function _sendJsonResponse($data, $code = 200)
        {
            http_response_code($code);
            header("Content-type: application/json; charset=utf-8;");
            $options = 0;
            if (defined('JSON_PRETTY_PRINT')) {
                $options &= JSON_PRETTY_PRINT;
            }

            if (defined('JSON_UNESCAPED_UNICODE')) {
                $options &= JSON_UNESCAPED_UNICODE;
            }

            if (false && version_compare(PHP_VERSION, '5.4', '>=')) {
                print json_encode($data, $options);
            } else {
                print json_encode($data);
            }
            die;
        }

        protected function _getViewPath($appName)
        {
            return __DIR__ . self::VIEW_FILES_DIR . $appName . self::LAYOUT_FILE_NAME;
        }
    }