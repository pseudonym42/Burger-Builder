import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import Spinner from '../../../components/UI/Spinner/Spinner';
import styles from './ContactData.module.css';
import axios from '../../../axios-orders';


class ContactData extends Component {

    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your name'
                },
                value: '',
                validation: {
                    isRequired: true,
                    minLength: 3
                },
                valid: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your street'
                },
                value: '',
                validation: {
                    isRequired: true
                },
                valid: false
            },
            postcode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your postcode'
                },
                value: '',
                validation: {
                    isRequired: true
                },
                valid: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your email'
                },
                value: '',
                validation: {
                    isRequired: true
                },
                valid: false
            },
            deliveryOption: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'express', displayValue: 'Express'},
                        {value: 'standard', displayValue: 'Standard'}
                    ]
                },
                value: 'express',
                valid: true
            }
        },
        loading: false
    }

    // validates fields, here rules is the value of
    // 'validation' key from the state
    checkValidity(value, rules) {
        let isFieldValid = false;

        // note that we have additional check everywhere which is
        // "isFieldValid &&", this allows us to put the validations
        // in sequence

        if (rules.isRequired) {
            isFieldValid = isFieldValid && value.trim() !== '';
        }

        if (rules.minLength) {
            isFieldValid = isFieldValid && value.length < rules.minLength;
        }

        return isFieldValid;
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });

        /*
            Get data from the form to submit customer data with
            the order form
        */

        const customerData = {};
        for (let item in this.state.orderForm) {
            customerData[item] = this.state.orderForm[item].value
        }
 
        /*
            Note that in real world app you would not submit the price
            from client but rather calculate the price on the server
            so user cannot manipulate it
        */
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.cost,
            customerData: customerData
        }

        /*
            we are using Firebase, so we did not create an API endpoint
            to handle our requests. But they will get created magically,
            for this to work we need to specify a namespace where all
            key-value pairs will be created like this:
                
                /<namespace>.json

            Note that below path will be appended to the baseURL to send
            the post request
        */
        axios.post("/orders.json", order)
            .then(response => {
                console.log("Order placed!");
                this.setState({
                    loading: false
                });
                this.props.history.push('/');
            })
            .catch(error => {
                console.log("ERROR: could not place the order!")
                this.setState({
                    loading: false
                });
            })
    }

    // This function updates state on each change in the input fields i.e.
    // each keyenter basically

    // inputIdentifier below will refer to postcode, email, street etc
    inputChangedHandler = (event, inputIdentifier) => {
        // note that spread operator does only shallow copy, thus nested
        // objects still refer to the original state object
        const updatedOrderForm = {
            ...this.state.orderForm
        };

        /*
            b'cos above copy is shallow and we need somehow get to 'value'
            property of 'input field' in the state object - we need to
            copy the specific 'input field' data (depending on the field that is
            being modified) into another variable, and then change its value
            and then update updatedOrderForm accordingly
        */

        // copy part of the updatedOrderForm into a new variable
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };

        // now updated the form with the new value
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(
            updatedFormElement.value,
            updatedFormElement.validation
        );
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        // now we can update the state
        this.setState({
            orderForm: updatedOrderForm
        });

    }

    render() {

        // generate form fields
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let orderForm = (
            <form onSubmit={this.orderHandler}>
                {
                    formElementsArray.map((formElement) => {
                        return (
                            <Input
                                key={formElement.id}
                                elementType={formElement.config.elementType}
                                elementConfig={formElement.config.elementConfig}
                                defaultValue={formElement.config.value}
                                changed={(event) => this.inputChangedHandler(event, formElement.id)}
                            />
                        );
                    })
                }
                <Button buttonType="Success">BUY</Button>
            </form>
        );

        if (this.state.loading) {
            orderForm = <Spinner />;
        }

        return (
            <div className={styles.ContactData}>
                <h1>Enter your contact data below</h1>
                {orderForm}
            </div>
        )
    }

}

export default ContactData;
