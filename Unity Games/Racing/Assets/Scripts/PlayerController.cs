using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PlayerController : MonoBehaviour
{

    public Text countText;
    public float speed;
    private Rigidbody rb;
    private int count;
    public Text winText;
    private float moveHorizontal;
    private float moveVertical;
    void Start()
    {
        rb = GetComponent<Rigidbody>();
        count = 0;
        SetCountText();
        //countText.text = "Count: " count.ToString();
    }
    void FixedUpdate()
    {
        moveHorizontal = Input.GetAxis("Horizontal"); ///pt rotire camera
        moveVertical = Input.GetAxis("Vertical"); //pt viteza

        Vector3 movement = new Vector3(-moveVertical, 0.0f, moveHorizontal);

        rb.AddForce(movement * speed * Time.deltaTime);
    }

    void OnTriggerEnter(Collider other)
    {
        if (other.gameObject.CompareTag("Coin"))
        {
            other.gameObject.SetActive(false);
            count = count + 1;
            SetCountText();
            //countText.text = "Count: " + count.ToString();
        }
        if (other.gameObject.CompareTag("Stop"))
        {
            winText.text = "You Win!";
            //aici se opreste
        }
    }

    void SetCountText()
    {
        countText.text = "Count: " + count.ToString();
    }


}