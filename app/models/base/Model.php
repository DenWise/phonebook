<?php


    namespace App\Models\Base;

    use App\Services\Db;

    class Model
    {
        public function getConn()
        {
            return Db::getInstance()->connection;
        }
    }