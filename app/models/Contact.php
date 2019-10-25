<?php


    namespace App\Models;

    use App\Models\Base\Model;

    class Contact extends Model
    {
        protected $_db;

        public function __construct()
        {
            $this->_db = $this->getConn();
        }

        public function validate($params)
        {
            return true;
        }

        public function getAll()
        {
            try {
                $contacts = $this->_db->contact->select()->run();
            } catch (\Exception $e) {
                return array(
                    "message" => "Error while getting all contacts: {$e->getMessage()}"
                );
            }

            $compact = array();

            foreach ($contacts as $contact) {
                $compact[$contact->id] = array(
                    'name' => $contact->name,
                    'number' => $contact->number
                );
            }

            return $compact;
        }

        public function getOne($id)
        {
            if ($contact = $this->_db->contact[$id]) {
                return array(
                    'id' => $contact->id,
                    'name' => $contact->name,
                    'phone' => $contact->number
                );
            } else {
                return  array(
                    'message' => "Contact not found."
                );
            }
        }

        public function create($params)
        {
            if (!isset($params['name']) || !isset($params['number'])) {
                throw new \Exception("Not enough data to create a contact.");
            }

            $contact = $this->_db->contact->create(array(
                'name' => $params['name'],
                'number' => $params['number']
            ));

            $contact->save();

            return $contact->id;
        }

        public function edit($id, $params)
        {
            $contact = $this->_db->contact[$id];

            if ($contact) {
                if (isset($params['name'])) $contact->name = $params['name'];
                if (isset($params['number'])) $contact->number = $params['number'];
                $contact->save();
            } else {
                throw new \Exception("Contact with such ID not found");
            }
        }

        public function delete($id)
        {
            $this->_db->contact->delete()->where('id = ', $id)->run();
        }
    }