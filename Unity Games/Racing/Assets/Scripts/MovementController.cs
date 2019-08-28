using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MovementController : MonoBehaviour
{
    public Rigidbody player;
    public Transform camPivot;
    public Transform cam;
    public float movementSpeed;
    public float rotationSpeed;
    float vertical;
    float heading = 0;


    void Update()
    { 
        heading += Input.GetAxis("Horizontal") * Time.deltaTime * rotationSpeed;
        camPivot.rotation = Quaternion.Euler(0, heading, 0);

        vertical = Input.GetAxis("Vertical");
        Vector3 camF = cam.forward;

        camF.y = 0;
        camF = camF.normalized;
        //transform.position += new Vector3(vertical, 0, 0) * Time.deltaTime;
        player.AddForce((camF * vertical) * Time.deltaTime * movementSpeed);
        //transform.position += (camF * vertical) * Time.deltaTime * movementSpeed;
    }
}
