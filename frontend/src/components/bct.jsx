import React, { useEffect } from "react";
import '../App.css';

function Bct() {
    useEffect(() => {
        const mybutton = document.getElementById('btn-back-to-top');
        
        function scrollfunction() {
            if (!mybutton) return;
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                mybutton.style.display = "block";
            } else {
                mybutton.style.display = "none";
            }
        }

        function backToTop() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }

        // Add scroll listener
        window.addEventListener('scroll', scrollfunction);
        // Add click listener to button if it exists
        mybutton?.addEventListener("click", backToTop);

        // Cleanup listeners on unmount
        return () => {
            window.removeEventListener('scroll', scrollfunction);
            mybutton?.removeEventListener("click", backToTop);
        };
    }, []); // Empty dependency array means this runs once on mount
    return(
        <button
            type="button"
            className="btn btn-floating btn-lg"
            id="btn-back-to-top">
            <i class="fas fa-arrow-up"></i>
        </button>
    )

}

export default Bct