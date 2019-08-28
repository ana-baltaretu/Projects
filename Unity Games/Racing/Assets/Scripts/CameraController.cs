using UnityEngine;
using System.Collections;

public class CameraController : MonoBehaviour
{
    //public float rotationSpeed;
    //public float rotationDistance;
    public GameObject player;
    public float playerX;
    public float playerY;
    public float playerZ;

    private Vector3 offset;
    private Vector3 cameraRotation;
    
    void Start()
    {
        //offset = transform.position - player.transform.position;
    }

    void Update()
    {
        playerX = player.transform.eulerAngles.x;
        playerY = player.transform.eulerAngles.y;
        playerZ = player.transform.eulerAngles.z;

        transform.eulerAngles = new Vector3(playerX - playerX, playerY, playerZ - playerZ);
    }
    void FixedUpdate()
    {
        //moveHorizontal = Input.GetAxis("Horizontal"); ///pt rotire camera
    }

    void LateUpdate()
    {
        /**
        
        if (moveHorizontal > 0)
        {
            offset = new Vector3(offset.x, offset.y, offset.z - rotationDistance);
            transform.rotation = new Quaternion(transform.rotation.x, transform.rotation.y + rotationSpeed,
                                      transform.rotation.z, transform.rotation.w);
        }
        else if (moveHorizontal < 0)
        {
            offset = new Vector3(offset.x , offset.y, offset.z + rotationDistance);
            transform.rotation = new Quaternion(transform.rotation.x, transform.rotation.y - rotationSpeed,
                                      transform.rotation.z, transform.rotation.w);
        }
        transform.position = player.transform.position + offset;
        
        if (moveHorizontal > 0)
        {
            transform.rotation = new Quaternion(transform.rotation.x, transform.rotation.y + rotationSpeed,
                                       transform.rotation.z, transform.rotation.w);
        }
        else if (moveHorizontal < 0)
        {
            transform.rotation = new Quaternion(transform.rotation.x, transform.rotation.y - rotationSpeed,
                                       transform.rotation.z, transform.rotation.w);
        }
       */

    }
}