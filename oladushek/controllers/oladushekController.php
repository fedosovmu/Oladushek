<?php

class oladushekController extends Controller
{
    public function index()
    {
        $oladushki = $this->model->load();
        $this->setResponse($oladushki);
    }

    public function view($data)
    {
        $oladushki = $this->model->load($data['id']);
        $this->setResponse($oladushki);
    }

    public function add()
    {
        $postData=json_decode(file_get_contents('php://input'), TRUE);

        if(isset($postData['id']) && isset($postData['name']) && isset($postData['image'])
            && isset($postData['vkus']) && isset($postData['speed'])){

            $dataToSave = array(
                'id' => $postData['id'],
                'name' => $postData['name'],
                'image' => $postData['image'],
                'vkus' => $postData['vkus'],
                'speed' => $postData['speed']);

            $addedItem=$this->model->create($dataToSave);
            $this->setResponse($addedItem);
        }
    }

    public function edit($data)
    {
        $postData=json_decode(file_get_contents('php://input'), TRUE);

        if(isset($postData['id']) && isset($postData['name']) && isset($postData['image'])
            && isset($postData['vkus']) && isset($postData['speed'])){

            $dataToSave = array(
                'id' => $postData['id'],
                'name' => $postData['name'],
                'image' => $postData['image'],
                'vkus' => $postData['vkus'],
                'speed' => $postData['speed']);

            $updateItem = $this->model->save($data['id'], $dataToSave);
            $this->setResponse($updateItem);
        }
    }

    public function delete($data)
    {
        $deleteItem = $this->model->delete($data['id']);
        $this->setResponse($deleteItem);
    }
}