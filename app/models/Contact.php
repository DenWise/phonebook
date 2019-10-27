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

        public function getAll($page)
        {
            try {
                $query = $this->_db->contact->select()
                    ->page($page)
                    ->perPage(7);

                $contacts = $query->run();
                $pagination = $query->getPageInfo();
            } catch (\Exception $e) {
                return array(
                    "message" => "Error while getting all contacts: {$e->getMessage()}"
                );
            }

            $compact = array(
                'pagination' => $pagination
            );

            return array_merge($compact,$this->_compact($contacts));
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
                'number' => preg_replace("#\s#","",$params['number'])
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

        public function search($type, $value, $page)
        {
            $query = $this->_db->contact->select()->where($type . ' like ', '%' . $value . '%')->page($page)->perPage(10);
            $found = $query->run();

            $compact = array(
                'pagination' => $query->getPageInfo()
            );

            return array_merge($compact,$this->_compact($found));
        }

        protected function _compact($elements)
        {
            $compact = array();

            foreach ($elements as $element) {
                $compact['contacts'][$element->id] = array(
                    'name' => $element->name,
                    'phone' => $element->number
                );
            }

            return $compact;
        }
    }